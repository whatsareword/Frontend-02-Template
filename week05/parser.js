// HTML解析
/*
第一步 -- 拆分文件
第二步 -- 创建状态机
第三步 -- 解析标签（tag） 开始标签，结束标签，自封闭标签
第四步 -- 创建元素
第五步 -- 处理属性
第六步 -- 用token构建DOM树
第七步 -- 将文本节点加到DOM树中
*/
let currentToken = null;
let currentAttribute = null;
let stack = [{type: "document", children: []}];
let currentTextNode = null;
const css = require('css');
const { match } = require('assert');
const layout = require('./layout');
function emit(token) {
    let top = stack[stack.length - 1];
    if (token.type == "startTag") {
        let element = {
            type: 'element',
            children: [],
            attributes: []
        }
        element.tagName = token.tagName;
        for (const p in token) {
            if (p != "type" && p != "tagName") {
                element.sttributes.push({
                    name: p,
                    valne: token[p]
                })
            }
        }
        top.children.push(element);
        element.parent = top;
        if (!token.isSelfClosing) {
            stack.push(element);
        }
        currentTextNode = null;
    } else if (token.type == "endTag") {
        if (top.tagName != token.tagName) {
            throw new Error("Tag start end doesn't match");
        } else {
            if(top.tagName === "style") {
                addCSSRules(top,children[0].content)
            }
            layout(top);
            stack.pop();
        }
        currentTextNode = null;
    } else if (token.type == "text") {
        if (currentTextNode == null) {
            currentTextNode = {
                type: "text",
                content: ""
            }
            top.children.push(currentTextNode);
        }
        currentTextNode.content += token.content;
    }
}
const EOF = Symbol("EOF");

module.exports.parseHTML = function parseHTML(html) {
    let state = data;
    for (let c of html) {
        state = state(c);
    }
    state = state(EOF);
}
function data(c) {
    if (c == "<") {
        return tagOpen;
    } else if (c == EOF) {
        emit({
            type: "EOF"
        });
        return;
    } else {
        emit({
            type: "text",
            content: c
        });
        return data;
    }
}
function tagOpen(c) {
    if (c == "/") {
        return endTagOpen;
    } else if (c.match(/^[a-zA-Z]$/)) {
        return tagName(c);
    } else {
        return;
    }
}
function endTagOpen(c) {
    if (c.match(/^[a-zA-Z]$/)) {
        currentToken = {
            type: "endTag",
            tagName: ""
        }
        return tagName(c);
    } else if (c == ">") {
        throw new Error("出错了");
    } else if (c == EOF) {
        throw new Error("出错了");
    } else {
        throw new Error("出错了");
    }
}
function tagName(c) {
    if (c.match(/^[\t\n\f]$/)) {
        return beforeAttributeName;
    } else if (c == "/") {
        return selfClosingStartTag;
    } else if (c.match(/^[a-zA-Z]$/)) {
        return tagName;
    } else if (c == ">") {
        emit(currentToken);
        return data;
    } else {
        return tagName;
    }
}
function beforeAttributeName(c) {
    if (c.match(/^[\t\n\f]$/)) {
        return beforeAttributeName;
    } else if (c == "/" || ">" || EOF) {
        return afterAttributeName(c);
    } else if (c == "=") {
        throw new Error("出错了");
    } else {
        currentAttribute = {
            name: "",
            value: ""
        }
        return attributeName(c);
    }
}
function attributeName(c) {
    if (c.match(/^[\t\n\f]$/) || c == "/" || c == ">" || c == EOF) {
        return afterAttributeName(c);
    } else if (c == "=") {
        return beforeAttributeValue;
    } else if (c == "\u0000") {
        throw new Error("出错了");
    } else if (c == "\"" || c == "'" || c == "<") {
        throw new Error("出错了");
    } else {
        currentAttribute.name += c;
        return attributeName;
    }
}
function beforeAttributeValue(c) {
    if (c.match(/^[\t\n\f]$/) || c == "/" || c == ">" || c == EOF) {
        return beforeAttributeValue;
    } else if (c == "\"") {
        return doubleQuotedAttributeValue;
    } else if (c == "\'") {
        return singleQuotedAttributeValue;
    } else if (c == ">") {
        throw new Error("出错了");
    } else {
        return UnquotedAttributeValue(c);
    }
}
function doubleQuotedAttributeValue(c) {
    if (c == "\"") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuotedAttributeValue;
    } else if (c == "\u0000") {
        throw new Error("出错了");
    } else if (c == EOF) {
        throw new Error("出错了");
    } else {
        currentAttribute.value += c;
        return doubleQuotedAttributeValue;
    }
}
function singleQuotedAttributeValue(c) {
    if (c == "\'") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuotedAttributeValue;
    } else if (c == "\u0000") {
        throw new Error("出错了");
    } else if (c == EOF) {
        throw new Error("出错了");
    } else {
        currentAttribute.value += c;
        return doubleQuotedAttributeValue;
    }
}
function afterQuotedAttributeValue(c) {
    if (c.match(/^[\t\n\f]$/)) {
        return beforeAttributeName;
    } else if (c == "/") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if (c == EOF) {
        throw new Error("出错了");
    } else {
        currentAttribute.value += c;
        return doubleQuotedAttributeValue;
    }
}
function UnquotedAttributeValue(c) {
    if (c.match(/^[\t\n\f]$/)) {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return beforeAttributeName;
    } else if (c == "/") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return selfClosingStartTag;
    } else if (c == ">") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if (c == "\u0000") {
        throw new Error("出错了");
    } else if (c == "\"" || c == "'" || c == "<" || c == "=" || c == "`") {
        throw new Error("出错了");
    } else if (c == EOF) {
        throw new Error("出错了");
    } else {
        currentAttribute.value += c;
        return UnquotedAttributeValue;
    }
}
function selfClosingStartTag(c) {
    if (c == ">") {
        currentToken.isSelfClosing = true;
        return data;
    } else if (c == EOF) {
        throw new Error("出错了");
    } else {
        throw new Error("出错了");
    }
}
// CSS 计算
let rules = [];
function addCSSRules(text) {
    var ast = css.parse(text);
    rules.push(...ast.stylesheet.rules);
}
function computeCSS(element) {
    var element = stack.clice().reverse();
    if(!element.computedStyle)
        element.computeCSS = {};
    for (let rule of rules) {
        var selectorParts = rule.selectors[0].split(" ").reverse();
        if(!match(element.selectorParts[0]))
            continue;
        let matched = false;
        var j = 1;
        for(var i = 0; i < customElements.length; i++) {
            if (match(elements[i], selectorParts[j])) {
                j++;
            }
        }
        if(j >= selectorParts.length)
            matched = true;
        if(matched) {
            var sp = specificity(rule.selectors[0]);
            var computedStyle = element.computedStyle;
            for (var declaration of rule.declarations) {
                if(!computedStyle[declaration.property])
                    computedStyle[declaration.property] = {};
                if(!computedStyle[declaration,property].specificity) {
                    computedStyle[declaration.property].value = declaration.value;
                    computedStyle[declaration.property].specificity = sp;
                } else if(compare(computedStyle[declaration.property].specificity, sp) < 0) {
                    computedStyle[declaration.property].value = declaration.value;
                    computedStyle[declaration.property].specificity = sp;
                }
            }
        }
    }
}
function match (element, selector) {
    if(!selector || ! element.attributes)
        return false;
    if(selector.charAt(0) === "#") {
        var attr = element.attributes.filter(attr => attr.name === "id")[0];
        if (attr && attr.value === selector.replace("#",''))
            return true;
    } else if (selector.charAt(0) === ".") {
        var attr = element.attributes.filter(attr => attr.name === "class")[0];
        if (attr && attr.value === selector.replace(".",''))
            return true;
    } else {
        if (element.tagName === selector) {
            return true;
        }
    }
    return false;
}
function specificity(selector) {
    var p = [0, 0, 0, 0];
    var selectorParts = selector.split(" ");
    for (const part of selectorParts) {
        if(part.charAt(0) === "#"){
            p[1] += 1;
        } else if (part.charAt(0) === "."){
            p[2] += 1;
        } else {
            p[3] += 1;
        }
    }
    return p;
}
function compare(sp1, sp2) {
    if(sp1[0] - sp2[0])
        return sp1[0] - sp2[0];
    if(sp1[1] - sp2[1])
        return sp1[1] - sp2[1];
    if(sp1[2] - sp2[2])
        return sp1[2] - sp2[2];
    return sp1[3] - sp2[3];
}