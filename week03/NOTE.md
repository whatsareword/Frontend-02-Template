# 学习笔记
## 一.运算符和表达式
在JavaScript中，它是用产生式来描述运算符的优先级的
#### 1.优先级最高是member运算
a.b
a[b]
foo`String`
super.b
super['b']
new.target
new Foo()
#### 2.new运算
new Foo
#### 3. call函数调用
foo()
super()
foo()['b']
foo().b
foo()`abc`
#### 左运算和右运算
a++
a--
--a
++a
#### 单目运算
delete a.b
void foo()
typeof a
+a
-a
~a
!a
await a
#### **运算
#### * / %
#### 位移
#### < > <= >= instans of in
#### == != === !==
#### & ^ |
#### && ||
#### ? : 三目运算符
## 二.类型转换
#### 普通类型转换
#### 装箱/拆箱转换
## 三.运行时
语句-简单语句、组合语句、声明
所有声明都有预处理机制。