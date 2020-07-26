# 学习笔记
## 一.浏览器工作原理
URL --http请求--> HTML --构建DOM树--> DOM --计算CSS--> DOM with CSS --排版--> DOM with position --渲染--> Bitmap
## 二.HTTP协议
HTTP协议是基于TCP协议出现的，在TCP基础上，规定了Request-Response的模式。这个模式决定了通讯必须是浏览器端首先发起的。
### HTTP格式
#### 1.request
1.request line (method, path, version)
2.head
3.body
#### 2.response
1.response line (version, status code, status text)
2.head
3.body
## 三.有限状态机
### 特点
#### 1.每一个状态机都是一个机器
1.在每一个机器里，都是互相解耦，可以做计算，存储，输出
2.所有的这些机器接受的输入是一致的
3.状态机的每一个机器本身没有状态，如果我们用函数来表示的话，它应该是纯函数
#### 2.每一个机器都必须知道下一个状态
1.Moore型：每个机器都有确定的下一个状态
2.Mealy型：每个机器根据输入决定下一个状态
```javascript
例：function state(input) {
    return next;
}
while(input) {
    state = state(input);
}
```
## 四.自己实现了一个HTTP请求和HTML解析
