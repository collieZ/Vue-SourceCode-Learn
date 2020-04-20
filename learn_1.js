/* Vue响应式系统基本原理 */
function getType(val) {
  return Object.prototype.toString.call(val).slice(8, -1)
}

function updateView() {
  // 更新视图
  console.log('更新视图');
}

// 设置对象属性为响应式
function defineReactive(obj, key, val) {
  /* 一个Dep类对象 */
  const dep = new Dep(); // 闭包

  Object.defineProperty(obj, key, {
    enumerable: true,       /* 属性可枚举 */
    configurable: true,     /* 属性可被修改或删除 */
    get: () => {
      /* 将Dep.target（即当前的Watcher对象存入dep的subs中） */
      dep.addSubs(Dep.target);
      console.log(Dep.target, 'Dep.target', dep);
      return val
    },
    set: (newVal) => {
      if (newVal === val) return
      /* 在set的时候触发dep的notify来通知所有的Watcher对象更新视图 */
      dep.notify();
      // val = newVal
      // updateView(newVal)
    }
  })
}


function observe(value = null) {
  if (!value || (typeof value !== 'object')) return

  Object.keys(value).forEach((key, idx) => {
    if (getType(value[key]) === 'Object') {
      observe(value[key])
      return
    }
    defineReactive(value, key, value[key])
  })
}


/* Vue响应式依赖收集追踪原理(观察者-订阅者模式) */

// 为什么要有依赖收集
// 1. 视图依赖的数据更新才更新视图
// 2. 找到所有依赖该数据的视图

// Q: dep data里面每个对象的属性都有一个dep实例？   一个vue实例只有一个watcher对象？ 多次读一个对象属性，多次执行getter，多次push  watcher？

/* 订阅者 它的主要作用是用来存放 Watcher(观察者对象) */
class Dep {
  constructor() {
    /* 用来存放Watcher对象的数组 */
    this.subs = []
  }

  /* 用来添加watcher对象到数组的方法 */
  addSubs(sub) {
    this.subs.push(sub)
  }

  /* 用来通知所有watcher对象更新数据方法 */
  notify() {
    this.subs.forEach(sub => {
      sub.update()
    })
  }
}

/* 观察者  */
class Watcher {
  constructor() {
    /* 在new一个Watcher对象时将该对象赋值给Dep.target，在get中会用到 */
    Dep.target = this;
  }

  /* 更新视图的方法 */
  update() {
    console.log("视图更新啦～");
  }
}

// 封装一个vue

class Vue {
  /* Vue构造类 */
  constructor(options) {
    this.$data = options.data;
    observe(this.$data);
    /* 新建一个Watcher观察者对象，这时候Dep.target会指向这个Watcher对象 */
    new Watcher();
    /* 在这里模拟render的过程，为了触发test属性的get函数 */
    console.log('render~', this.$data.name);
  }

  getData() {
    console.log(this.$data);
  }
}

let VM = new Vue({
  data: {
    name: 'zzw',
    age: 12,
    mm: {
      name: 'kk',
      age: 50
    }
  }
})

console.log(VM.$data.name, Dep);
// console.log(VM.$data.mm.name = 'ss');
// console.log(VM.$data.mm.name);
// console.log(VM.$data);
Dep.target = null;

/* 实现 Virtual DOM 下的一个 VNode 节点 */
