import Text from '../component/Typography/Text'
import Title from '../component/Typography/Title'
import Paragraph from '../component/Typography/Paragraph'
import { v4 as uuidv4 } from 'uuid';

const paragraph = (block) => {
    let detail = block.paragraph
    let {elements, style} = detail
    let vdoms = []
    for (let elementBlock of elements) {
        let {type} = elementBlock
        let eleParser = blockParserMap[type]
        if (!eleParser) continue
        // collect all created vdom
        vdoms.push(eleParser(elementBlock[type]))
    }
    console.log(vdoms)
    return <Paragraph key={uuidv4()}>{vdoms}</Paragraph>
}

const textRun = (block) => {
    let {text, style} = block
    // console.log('text=', text, ';style=', style)
    // TODO use enum class or 
    // final: inner style
    return <Text key={uuidv4()}>{text}</Text>
}

const styleParserMap = {
    'quote': '',
    'backColor': ''
}

const blockParserMap = {
    paragraph,
    textRun
}

const parseBlock = (block) => {
    let {type} = block
    let parser = blockParserMap[type]
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
    return <div>{vdoms}</div>
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
    return <Title heading={2}>{title}</Title>
}