# PipeScheduler

## 作用

依次执行异步操作（调用接口），完成任务

## 何时使用

需要依次调用异步方法进行处理时
例如：添加标签，需要先添加一级、二级、三级分类后再进行添加

## 如何使用

1. 实例化PipeScheduler得到实例scheduler
2. 在实例scheduler上调用scheduler.add()方法添加操作
3. 添加完成后调用scheduler.excute()方法开始执行
4. 执行excute后得到Promise对象

```js
const scheduler = new PipeScheduler()
scheduler.add({
  url: '/api/addType1',
  fetchMethod: axios.post
})
scheduler.add({
  url: '/api/addType2',
  fetchMethod: axios.post
})
scheduler.add({
  url: '/api/addType3',
  fetchMethod: axios.post
})
scheduler.excute().then(res => {
  console.log(res, 'after');
})
```
