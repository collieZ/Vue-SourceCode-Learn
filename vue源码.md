# 浅析 Object.defineProperty

## 使用方法及参数
``` javascript
/*
    obj: 目标对象
    prop: 需要操作的目标对象的属性名
    descriptor: 描述符
    return value 传入对象
*/
Object.defineProperty(obj, prop, descriptor)
```

descriptor 的一些属性

* `enumerable` 属性是否可枚举，默认 false。
* `configurable` 属性是否可以被修改或者删除，默认 false。
* `get` 获取属性的方法。
* `set` 设置属性的方法。

