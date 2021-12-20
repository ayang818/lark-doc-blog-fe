// import OLText from '../component/Typography/Text'
// import OLTitle from '../component/Typography/Title'
// import OLParagraph from '../component/Typography/Paragraph'
import { v4 as uuidv4 } from 'uuid';
import { Typography } from '@douyinfe/semi-ui'
import ImageShow from '../component/Typography/ImageShow';
import { cloneElement } from 'react';

// TODO 如何封装一个组件
const {Text:OLText, Title:OLTitle, Paragraph:OLParagraph} = Typography

const styleCaster = (styleTypeDict, vdoms) => {
    /*
    * styleTypeDict: 原始的语义化 json style，非标准 css
    * vdoms: 子节点列表
    */
    let styleDict = {}
    let elementPropsDict = {}
    // 如果没有样式 直接返回
    let vdomList = vdoms
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

const paragraph = (block) => {
    let detail = block.paragraph
    let {elements, style:styleTypeDict, lineId} = detail

    // 解析所有子节点
    let vdoms = []
    for (let elementBlock of elements) {
        let {type} = elementBlock
        // 根据 type 取 blockParser
        let eleParser = blockParserDict[type]
        if (!eleParser) continue
        // 解析子节点
        vdoms.push(eleParser(elementBlock[type]))
    }
    console.log('before vdoms', vdoms)
    // 对整个 block 进行样式转换，拿到标准的 css 和 props
    let {styleDict, elementPropsDict, vdomList:wrapperedVDOM} = styleCaster(styleTypeDict, vdoms)
    console.log('style parsed vdoms', wrapperedVDOM)
    // 传递 style 和 props，渲染整个节点
    return <OLParagraph spacing='extended' style={styleDict} key={lineId} {...elementPropsDict}>{wrapperedVDOM}</OLParagraph>
}


const textRun = (block) => {
    let {text, style:styleTypeDict} = block
    let atomicVDOM = <OLText key={uuidv4()}>{text}</OLText>
    return atomicVDOM
}

const gallery = (block) => {
    let {gallery:{imageList}} = block
    if (!imageList || imageList.length == 0) return <div></div>
    let vdoms = []
    for (let image of imageList) {
        let {fileToken, width, height} = image
        vdoms.push(<ImageShow key={uuidv4()} fileToken={fileToken} width={width} height={height}></ImageShow>)
    } 
    return <div key={uuidv4()}>{vdoms}</div>
}

// 不需要对子节点做重写的，直接返回 style 和 对应组件的 props
// 需要对子节点做重写的，接收参数 vdoms，操作每个 vdom.props 进行重写
const styleTypeParserDict = {
    quote: (isQuote, vdoms) => ({
        style: {
            borderLeft: '2px solid rgba(var(--semi-blue-5), 1)',
            height: '80%',
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
                strong: true
            })
            finalVDOMs.push(newDOM)
        }
        return {
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
        for (let vdom of vdoms) {
            let space = ''
            for (let i =0;i<indentLevel-1;i++){
                // space += "<pre>&nbsp;&nbsp;&nbsp;&nbsp;</pre>"
                space += "\xa0\xa0\xa0\xa0\xa0\xa0"
            }
            let newChildren
            console.log(vdom)
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
        }
        return {
            vdoms: finalVDOMs
        }
    }
}

const styleTypeParser = (styleType, styleTypeValue, vdoms) => {
    console.log(styleType, '=', styleTypeValue)
    let castFunc = styleTypeParserDict[styleType] 
    if (!castFunc) return {}
    // 这里到底返回一个 vdom 还是 一组属性
    return castFunc(styleTypeValue, vdoms)
}


const blockParserDict = {
    paragraph,
    textRun,
    gallery
}

const parseBlock = (block) => {
    let {type} = block
    let parser = blockParserDict[type]
    if (!parser) return <div></div>
    // console.log(type, 'parser mapped')
    return parser(block)
}

export const parseBody = (all) => {
    let {body} = all
    let blocks = body.blocks
    let vdoms = []
    for (let block of blocks) {
        vdoms.push(parseBlock(block))
    }
    return <div key={uuidv4()}>{vdoms}</div>
} 

export const parseTitle = (all) => {
    let {title:{elements}} = all
    let title = ''
    // 暂时忽略标题颜色格式
    for (let element of elements) {
        if (element.type !== 'textRun') continue
        let {textRun:{text}} = element
        title += text
    }
    return <OLTitle key={uuidv4()} heading={2}>{title}</OLTitle>
}