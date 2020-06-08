## 手写一个简版的Vue

## 知识点

1. Object.defineProperty


>javacript 有三种类型的属性
* 命名数据属性：拥有一个确定的值的属性。这也是最常见的属性
* 命名访问器属性：通过getter和setter进行读取和赋值的属性
* 内部属性：由JavaScript引擎内部使用的属性，不能通过JavaScript代码直接访问到，不过可以通过一些方法间接的读取和设置。比如，每个对象都有一个内部属性[[Prototype]]，你不能直接访问这个属性，但可以通过Object.getPrototypeOf()方法间接的读取到它的值。虽然内部属性通常用一个双吕括号包围的名称来表示，但实际上这并不是它们的名字，它们是一种抽象操作，是不可见的，根本没有上面两种属性有的那种字符串类型的属性

2. nodeType
>nodeType 属性返回节点类型。

* 如果节点是一个元素节点，nodeType 属性返回 1。
* 如果节点是属性节点, nodeType 属性返回 2。
* 如果节点是一个文本节点，nodeType 属性返回 3。
* 如果节点是一个注释节点，nodeType 属性返回 8。
* 该属性是只读的。

3. childNodes 属性返回节点的子节点集合，以 NodeList 对象


4. RegExp.$1 RegExp.$2

5. ....

#### 思路  

### 不走虚拟DOM DOMdiff算法

### 获取dom --->遍历子元素---> 编译节点 --->遍历属性 

* 遍历属性
  1. {{}}    处理插值
  2. e-text  处理textContent
  3. e-html  处理innerhtml
  4. e-model 处理input 监听什么的
  5. @开头的  绑定click事件  








### Vue3.0 核心API Proxy
> 语法 let p = new Proxy(target, handler);
##### 参数
1. target ：需要使用Proxy包装的目标对象（可以是任何类型的对象，包括原生数组，函数，甚至另一个代理）。
2. handler: 一个对象，其属性是当执行一个操作时定义代理的行为的函数(可以理解为某种触发器)。具体的handler相关函数请查阅官网

```js
  let test = {
    name: "小红"
  };
  test = new Proxy(test, {
    get(target, key) {
      console.log('获取了getter属性');
      return target[key];
    },
    set(target, key, value) {
      if (key === "age" && typeof value !== "number") {
        throw Error("age字段必须为Number类型");
      }
      // Reflect https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect
      return Reflect.set(target, key, value);
    }
  });
  console.log(test.name);
```