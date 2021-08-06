/**
 * el:宿主元素的选择器
 * vm：EVue 实例
 * @class Compiler
 */

class Compiler {
  constructor(el, vm) {

    this.$vm = vm;

    this.$el = document.querySelector(el);

    // 执行编译
    this.compiler(this.$el);
  }

  compiler(el) {
    if (!el) throw '当前挂载根标签不存在';
    const childNodes = el.childNodes;
    console.log(childNodes, 'el的子节点');
    Array.from(childNodes).forEach(node => {
      // 判断节点类型
      // dom 元素
      if (this.isElement(node)) {
        // console.log("编译元素",node.nodeName);
        this.compileElement(node);
        // 插值{{}}
      } else if (this.isDoubleBraceInter(node)) {
        this.compilerText(node);
      }
      // 递归
      this.compiler(node);
    });
  }

  compilerText(node) {
    // 编译插值文本
    this.update(node, RegExp.$1, 'text');
  }

  compileElement(node) {
    // console.log(node,'编译ELE');
    const nodeAttr = node.attributes;
    Array.from(nodeAttr).forEach(attr => {
      const attrName = attr.name;
      const attrValue = attr.value;
      if (this.isDirective(attrName)) {
        //  截取指令
        const dire = attrName.substring(2);
        console.log(attrName, dire);
        // 执行对应指令的更新函数
        this[dire] && this[dire](node, attrValue);
      }
      if (this.isEvent(attrName)) {
        // @click=changeName
        const dire = attrName.substring(1);
        this.eventHandler(node, attrValue, dire);
      }
    });
  }

  update(node, exp, dire) {
    // 初始化页面
    const updateFn = this[`${dire}Updater`];

    updateFn && updateFn(node, this.$vm[exp]);

    // 更新
    new Watcher(this.$vm, exp, function(value) {
      updateFn && updateFn(node, value);
    });
  }

  text(node, exp) {
    this.update(node, exp, 'text');
  }

  textUpdater(node, value) {
    node.textContent = value;
  }

  html(node, exp) {
    // console.error("这里走了吗")
    this.update(node, exp, 'html');
  }
  htmlUpdater(node, value) {
    node.innerHTML = value;
  }

  model(node, exp) {
    this.update(node, exp, 'model');
    // 事件监听
    node.addEventListener('input', e => {
      this.$vm[exp] = e.target.value;
    });
  }
  modelUpdater(node, value) {
    node.value = value;
  }
  eventHandler(node, exp, dire) {
    const CB = this.$vm.$options.methods && this.$vm.$options.methods[exp];
    if (CB) {
      node.addEventListener(dire, CB.bind(this.$vm));
    }
  }
}

Compiler.prototype.isElement = u_isElement; // 是否是元素节点
Compiler.prototype.isDoubleBraceInter = u_isDoubleBraceInter; // 是否是{{}}
Compiler.prototype.isDirective = u_isDirective; // 是否是指令
Compiler.prototype.isEvent = u_isEvent; // 是否是事件
