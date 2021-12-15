import Text from '../component/Typography/Text'

const paragraph = (block) => {
    let detail = block.paragraph
    let {elements, style} = detail
    for (let elementBlock of elements) {
        let {type} = elementBlock
        let eleParser = blockParserMap[type]
        let elementVDOM = eleParser(elementBlock)

    }
}

const textRun = (block) => {
    let {text, style} = block
    console.log(text, style)
    // TODO use enum class or 
    // final: inner style
    return <Text style={{}}>{text}</Text>
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
    console.log(type, 'parser mapped', parser)
    return parser(block)
}

const parse = (content) => {
    let {title, body} = content
    let blocks = body.blocks
    for (let block of blocks) {
        parseBlock(block)
    }
} 
