import { v4 as uuidv4 } from 'uuid';
import { Typography } from '@douyinfe/semi-ui'
import ImageShow from '../component/Typography/ImageShow';
import { styleCaster } from './styleParser';
import { Prism as CodeBlocks } from 'react-syntax-highlighter';

// TODO 如何封装一个组件
const {Text:OLText, Title:OLTitle, Paragraph:OLParagraph} = Typography

// paragraph block parser
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
    console.debug('before vdoms', vdoms)
    // 对整个 block 进行样式转换，拿到标准的 css 和 props
    let {styleDict, elementPropsDict, vdomList:wrapperedVDOM} = styleCaster(styleTypeDict, vdoms)
    console.debug('style parsed vdoms', wrapperedVDOM)
    // 传递 style 和 props，渲染整个节点
    return <OLParagraph spacing='extended' style={styleDict} key={lineId} {...elementPropsDict}>{wrapperedVDOM}</OLParagraph>
}

// textRun block parser
const textRun = (block) => {
    let {text, style} = block
    // 将所有的空格都换成能 html 能解析的形式，否则多个空格会被解析成一个
    text = String(text).replaceAll(' ', '\xa0')
    let {styleDict, elementPropsDict} = styleCaster(style)
    let atomicVDOM = <OLText style={styleDict} key={uuidv4()}>{text}</OLText>
    return atomicVDOM
}

// image block parser
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

// code block parser
const code = (block) => {
    let {code} = block
    let {language:lang, body:{blocks:codeBlocks}} = code
    let vdoms = []
    let codeText = ""
    let len = codeBlocks.length
    for (let i = 0; i < len; i++) {
        let codeBlock = codeBlocks[i]
        // vdoms.push(parseBlock(codeBlock))
        let {paragraph:{elements}} = codeBlock
        if (elements.length === 0) continue
        for (let elem of elements) {
            let {textRun:{text:plainText}} = elem
            codeText += plainText
        }
        if (i != len - 1) {
            codeText += '\n'
        }
    }
    // TODO 这里如何做到局部高亮？代码的局部高亮很重要！
    return <CodeBlocks language={lang.toLowerCase()}>
       {/* {vdoms} */}
       {codeText}
    </CodeBlocks>
}

const blockParserDict = {
    paragraph,
    textRun,
    gallery,
    code
}


// block 转换器入口
export const parseBlock = (block) => {
    let {type} = block
    let parser = blockParserDict[type]
    if (!parser) return <div></div>
    // console.log(type, 'parser mapped')
    return parser(block)
}