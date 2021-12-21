import { cloneElement } from 'react';

// style 转换器入口，将 json 中的 style 转化为标准 css 和 组件的 props。可修改 children 内容
export const styleCaster = (styleTypeDict, vdoms) => {
    /*
    * styleTypeDict: 原始的语义化 json style，非标准 css
    * vdoms: 子节点列表
    */
    let styleDict = {}
    let elementPropsDict = {}
    // 如果没有样式 直接返回
    let vdomList = vdoms
    // 合并样式 和 props
    if (styleTypeDict) {
        for (let styleType of Object.keys(styleTypeDict)) {
            let {style, elementProps, vdoms:vdomLi} = styleTypeParser(styleType, styleTypeDict[styleType], vdoms)
            styleDict = {...styleDict, ...style}
            elementPropsDict = {...elementPropsDict, ...elementProps}
            vdomList = vdomLi
        }
    }
    return {styleDict, elementPropsDict, vdomList}
}

// 不需要对子节点做重写的，直接返回 style 和 对应组件的 props
// 需要对子节点做重写的，接收参数 vdoms，操作每个 vdom.props 进行重写
const styleTypeParserDict = {
    quote: (isQuote, vdoms) => ({
        style: {
            borderLeft: '2px solid rgba(var(--semi-blue-5), 1)',
            height: '100%',
            padding: '0 0 5px 10px',
            margin: '5px 0 5px 0'
        },
        elementProps: {

        },
        vdoms
    }),
    headingLevel: (level, vdoms) => {
    // 如果有需要，对子节点每个标签进行包装
        let finalVDOMs = []
        for (let vdom of vdoms) {
            let newDOM = cloneElement(vdom, {
                style: {
                    fontSize: `${1 + 0.6/level}rem`,
                },
                strong: true,
                className: `title-${level}`
            })
            finalVDOMs.push(newDOM)
        }
        return {
            style: {
                margin: '10px 0 10px 0'
            },
            vdoms: finalVDOMs
        }
    },
    align: (space, vdoms) => ({
        style: {
            textAlign: space
        },
        vdoms
    }),
    // list 属于上下文有关联的有层级 html 成分，例如
    // 1. xxx
    //     1. xxx
    //     2. xxx
    // 2. xxx 
    // 但是 json 没有顺序，而且获取上下文也困难，
    // 所以按照 style 的 indentLevel 直接渲染层级，不按照 html 的标准 <li></li> 形式渲染
    list: (liStyle, vdoms) => {
        const {type, indentLevel, number} = liStyle
        let finalVDOMs= []
        let firstPrefix = true
        for (let vdom of vdoms) {
            if (!firstPrefix) {
                finalVDOMs.push(vdom)
                continue
            }
            // 计算这个 list item 前面需要几组空格
            let space = ''
            for (let i =0;i<indentLevel-1;i++){
                // space += "<pre>&nbsp;&nbsp;&nbsp;&nbsp;</pre>"
                space += "\xa0\xa0\xa0\xa0\xa0\xa0"
            }
            let newChildren
            // 拿到内容
            let childrenText = ""
            if (vdom.props.children instanceof Array) {
                childrenText = vdom.props.children.join("")
            } else {
                childrenText = vdom.props.children
            }
            let className
            if (type == 'bullet') {
                newChildren = `${space}o ${childrenText}`
                className = 'ul-item'
            } else if (type == 'number') {
                newChildren = `${space}${String(number)}. ${childrenText}`
                className = 'ul-item'
            }
            let newVDOM = cloneElement(vdom, {
                className
            }, newChildren)
            if (space.length != 0) {
                console.warn(newVDOM)
            }
            finalVDOMs.push(newVDOM)
            firstPrefix = false
        }
        return {
            vdoms: finalVDOMs
        }
    },
    backColor: (colorDict) => {
        let {red, green, blue, alpha} = colorDict
        console.warn(red, green)
        return {
            style: {
                background: `rgba(${red}, ${green}, ${blue}, ${alpha})`
            }
        }
    }
}

const styleTypeParser = (styleType, styleTypeValue, vdoms) => {
    console.debug(styleType, '=', styleTypeValue)
    let castFunc = styleTypeParserDict[styleType] 
    if (!castFunc) return {}
    // 这里到底返回一个 vdom 还是 一组属性
    return castFunc(styleTypeValue, vdoms)
}