// 需求分析 数据响应化 依赖收集

class Evue {
  constructor(options) {
    this.$options = options;
    this.$data = options.data;

    // 观察
    this.observer(this.$data);

    new Compiler(options.el, this);

    if (options.created) {
      // 钩子函数
      options.created.bind(this)();
    }
  }
  observer(data) {
    if (!data || typeof data !== 'object') return;
    // 遍历 ergodic
    Object.keys(data).forEach(key => {
      // 递归 防止obj
      this.observer(data[key]);
      // 响应化数据处理
      this.defineReactive(data, key, data[key]);
      // 代理  this.test 可以直接访问 this.$data.test
      this.proxyData(key);
    });
  }
  defineReactive(obj, key, value) {
    // 创建Dep实例和key一一对应
    const dep = new Dep();

    Object.defineProperty(obj, key, {
      get() {
        //  依赖收集
        // console.log("依赖收集问题",Dep.target)
        Dep.target && dep.addDep(Dep.target);
        return value;
      },
      set(newVal) {
        if (newVal === value) return;
        // console.log("这里进入更新了吗",newVal)
        value = newVal;
        dep.notify();
      }
    });
  }

  proxyData(key) {
    // 给 Evue实例定义属性
    Object.defineProperty(this, key, {
      get() {
        return this.$data[key];
      },
      set(newVal) {
        this.$data[key] = newVal;
      }
    });
  }
}

// Dep:和data中的每一个key对应，主要负责管理相关的watcher

class Dep {
  constructor() {
    this.deps = [];
  }

  addDep(dep) {
    this.deps.push(dep);
  }

  notify() {
    // console.log("通知更新啊",this.deps)
    this.deps.forEach(dep => dep.update());
  }
}

// Watcher:负责创建data中key和更新函数映射关系
class Watcher {
  constructor(vm, key, cb) {
    this.vm = vm;
    this.key = key;
    this.cb = cb;
    // console.log("这里没有new吗")
    // 把Dep类的target属性 = watcher的实例
    Dep.target = this;

    this.vm[this.key]; // 出发依赖收集
    // 制空
    Dep.target = null;
  }
  update() {
    console.log(`${this.key} 更新了`);
    this.cb.bind(this)(this.vm[this.key]);
  }
}
