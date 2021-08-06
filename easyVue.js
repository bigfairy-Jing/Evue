// 需求分析 数据响应化 依赖收集

class Evue {
  constructor(options) {
    this.$options = options;
    this.$data = options.data();

    // ①代理methods
    this.proxyMethods(this.$options.methods || {})

    // ③观察 以及代理data
    this.observer(this.$data);

    // ②调用生命周期 钩子函数 created
    if (options.created) {
      options.created.bind(this)();
    }
    // ④调用Compiler
    new Compiler(options.el, this);
  }
  observer(data) {
    if (!data || typeof data !== 'object') return;
    // 遍历 ergodic
    Object.keys(data).forEach(key => {
      // ①递归 防止obj
      this.observer(data[key]);
      // ③响应化数据处理
      this.defineReactive(data, key, data[key]);
      // ②代理  this.test 可以直接访问 this.$data.test
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

  proxyMethods(methods) {
    const _this = this
    Object.keys(methods).forEach(key => {

      if (typeof methods[key] !== 'function') throw Error('method should be function!!');

      Object.defineProperty(_this, key, {
        get() {
          return methods[key]
        },
        set() {
          throw Error('Method cannot be set!!')
        }
      })
    })
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

    this.vm[this.key]; // 触发依赖收集 就是触发第41行代码
    // 制空
    Dep.target = null;
  }
  update() {
    console.log(`${this.key} 更新了`);
    this.cb.bind(this)(this.vm[this.key]);
  }
}