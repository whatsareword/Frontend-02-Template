# 学习笔记
## 一.通过产生式（BNF）工具学习语言
0型：无限制文法
1型：上下文相关文法
2型：上下文无关文法
3型：正则文法
1.用尖括号括起来的名称表示语法结构
2.语法结构分成终结符和非终结符
终结符{Number,+,-,*,/}
3.引号和中间字符表示终结符
4.*-重复多次
5.|-或
6.+-至少一次
```javascript
例：<MultiplicationExpression>::=<Number>|<MultiplicationExpression>"*"<Number>|<MultiplicationExpression>"/"<Number>
<AddtiveExpression>::=<MultiplicationExpression>|<AddtiveExpression>"+"<MultiplicationExpression>|<AddtiveExpression>"-"<MultiplicationExpression>
```
## 二.语言分类
形式语言-用途
数据描述语言-Json,HTML,CSS
编程语言-JavaScript
形式语言-表达方式
声明式语言-Json,HTML,CSS
命令型语言-JavaScript
## 三.JS基础类型
#### 1.Number-IEEE754 float表示方式
1个数字由指数和有效位数组成，指数决定浮点数的表示范围，有效位数决定浮点数表示的精度
双精度浮点数有一个符号位，11个指数位，1个隐藏位，52个精度位
float=精度位*2^指数
#### 2.String ASCII、Unicode字符集、UTF编码方式
#### 3.空值 Null,Undefined
#### 4.boolean
#### 5.Object -描述原型
对象{唯一性标识，状态，行为（状态的改变）}
#### 6.Symbol
# 总结
这周通过产生式工具学习了JS语言，也从更深入的方式重新认识了JS的基本类型。
老师讲的内容深入难懂，需要多次反复琢磨和思考。