// 依赖的一些纯方法或者变量

const u_doubleBraceReg = /\{\{(.*)\}\}/;

// 是否是元素节点
const u_isElement = node => {
  return node.nodeType === 1;
};
// 是否是插槽值
const u_isDoubleBraceInter = node => {
  return node.nodeType === 3 && u_doubleBraceReg.test(node.textContent);
};
// 是否是指令
const u_isDirective = attr => {
  // 这里大小写 要注意 这里转换过来只有小写
  return attr.indexOf('e-') === 0;
};
// 是否是事件
const u_isEvent = attr => {
  // 这里大小写 要注意
  return attr.indexOf('@') === 0;
};
