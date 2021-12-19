// import OLText from '../component/Typography/Text'
// import OLTitle from '../component/Typography/Title'
// import OLParagraph from '../component/Typography/Paragraph'
import { v4 as uuidv4 } from 'uuid';
import { Typography } from '@douyinfe/semi-ui'
import ImageShow from '../component/Typography/ImageShow';
// TODO 如何封装一个组件
const {Text:OLText, Title:OLTitle, Paragraph:OLParagraph} = Typography

const componentNameCast = {
    title: (props, children) => {
        console.log('props', props, children)
        let content = ''
        // 直接渲染 children 的内容，因为父元素的人工内容被子元素的默认内容给覆盖了
        for (let child of children) {
            content += child.props.children
        }
        return <OLTitle style={{fontSize: `${1 + 0.6/props.heading}rem`}}>{content}</OLTitle>
    }
}

const paragraph = (block) => {
    let detail = block.paragraph
    let {elements, style:styleTypeDict, lineId} = detail
    let vdoms = []
    for (let elementBlock of elements) {
        let {type} = elementBlock
        let eleParser = blockParserDict[type]
        if (!eleParser) continue
        // collect all created vdom
        vdoms.push(eleParser(elementBlock[type]))
    }
    // TODO: parse style from styleTypes then merge
    let styleDict = {}
    let elementPropsDict = {}
    let finalElement
    if (styleTypeDict) {
        for (let styleType of Object.keys(styleTypeDict)) {
            let {style, elementProps, targetElement} = styleTypeParser(styleType, styleTypeDict[styleType])
            styleDict = {...styleDict, ...style}
            elementPropsDict = {...elementPropsDict, ...elementProps}
            finalElement = targetElement 
        }
    }
    if (finalElement) {
        return componentNameCast[finalElement](elementPropsDict, vdoms)
    }
    return <OLParagraph spacing='extended' style={styleDict} key={lineId} {...elementPropsDict}>{vdoms}</OLParagraph>
}

const textRun = (block) => {
    let {text, style} = block
    // console.log('text=', text, ';style=', style)
    // TODO use enum class or 
    // final: inner style
    // return <OLText key={uuidv4()}>{text}</OLText>
    return <OLText key={uuidv4()}>{text}</OLText>
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

const styleTypeParserDict = {
    quote: (isQuote) => ({
        style: {
            borderLeft: '2px solid rgba(var(--semi-blue-5), 1)',
            height: '100%',
            padding: '0 0 5px 10px'
        },
        elementProps: {

        }
    }),
    headingLevel: (level) => ({
        style: {

        },
        elementProps: {
            heading: level
        },
        targetElement: 'title'
    }),
    align: (space) => ({
        style: {
            textAlign: space
        }
    })
}

const styleTypeParser = (styleType, styleTypeValue) => {
    console.log(styleType, '=', styleTypeValue)
    let castFunc = styleTypeParserDict[styleType] 
    if (!castFunc) return {}
    return castFunc(styleTypeValue)
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