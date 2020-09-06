const reg = /([0-9\.]+)|([\t]+)|([\r\n]+)|(\*)|(\/)|(\+)|(\-)/g
var dictionary = ["number","whitespace","lineterminator","*","/","+","-"]


function* tokensize(source) {
    var lastIndex = 0;
    var result = null;
    while(true) {
        result = reg.exec(source)
        lastIndex = reg.lastIndex
        if (!result) {
            break;
        }
        if (reg.lastIndex - lastIndex > result[0].length) {
            break
        }
        let token = {
            type: null,
            val:null
        }
        for (let i = 1; i <= dictionary.length + 1; i++) {
            if (result[i]) {
                token.type = dictionary[i -1]
            }
        }
        token.val = result[0];
        yield token;
    }
    yield {
        type: "EOP"
    }
}

for (let iterator of tokensize("1024 + 10 * 25")) {
    if (iterator.type !== "whitespace" && token.type !== "lineterminator") {
        source.push(iterator)
    }
    
}
function Expression(tokens) {
    if (source[0].type !== "AdditiveExpression" && source[1] && source[1].type === "EOF") {
        let node = {
            type:"Expression",
            children: [source.shift(),source.shift()]
        }
        source.unshift(node);
        return node;
    }
    AdditiveExpression(source)
    return Expression(source)
}
function AdditiveExpression(source) {
    if (source[0].type === "MultiplicativeExpression") {
        let node = {
            type: "AdditiveExpression",
            children: [source[0]]
        }
        return AdditiveExpression(source)
    }
    if (source[0].type === "AdditiveExpression" && source[1] && source[1].type === "+") {
        let node = {
            type: "AdditiveExpression",
            operator: "+",
            children: []
        }
        node.children.push(source.shift());
        node.children.push(source.shift());
        MultiplicativeExpression(source)
        node.children.push(source.shift());
        source.unshift(node);
        return AdditiveExpression(source)
    }
    if (source[0].type === "AdditiveExpression" && source[1] && source[1].type === "-") {
        let node = {
            type: "AdditiveExpression",
            operator: "-",
            children: []
        }
        node.children.push(source.shift());
        node.children.push(source.shift());
        MultiplicativeExpression(source)
        node.children.push(source.shift());
        source.unshift(node);
        return MultiplicativeExpression(source)
    }
    if (source[0].type === "AdditiveExpression") {
        return source[0];
    }
    MultiplicativeExpression(source)
    return AdditiveExpression(source)
}
function MultiplicativeExpression(source) {
    if (source[0].type === "Number") {
        let node = {
            type: "MultiplicativeExpression",
            children: [source[0]]
        }
        return MultiplicativeExpression(source)
    }
    if (source[0].type === "MultiplicativeExpression" && source[1] && source[1].type === "*") {
        let node = {
            type: "MultiplicativeExpression",
            operator: "*",
            children: []
        }
        node.children.push(source.shift());
        node.children.push(source.shift());
        node.children.push(source.shift());
        source.unshift(node);
        return MultiplicativeExpression(source)
    }
    if (source[0].type === "MultiplicativeExpression" && source[1] && source[1].type === "/") {
        let node = {
            type: "MultiplicativeExpression",
            operator: "/",
            children: []
        }
        node.children.push(source.shift());
        node.children.push(source.shift());
        node.children.push(source.shift());
        source.unshift(node);
        return MultiplicativeExpression(source)
    }
    if (source[0].type === "MultiplicativeExpression") {
        return source[0];
    }
    return MultiplicativeExpression(source)
}
MultiplicativeExpression("10 * 25")