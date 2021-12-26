// import OLText from '../component/Typography/Text'
// import OLTitle from '../component/Typography/Title'
// import OLParagraph from '../component/Typography/Paragraph'
import { v4 as uuidv4 } from 'uuid';
import { Typography } from '@douyinfe/semi-ui'
import { styleCaster } from './styleParser';
import { parseBlock } from './blockParser';

const {Text:OLText, Title:OLTitle, Paragraph:OLParagraph} = Typography

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
    let {title:{elements, style}} = all
    let title = ''
    for (let element of elements) {
        if (element.type !== 'textRun') continue
        let {textRun:{text}} = element
        title += text
    }
    let {styleDict} = styleCaster(style)
    return <OLTitle style={styleDict} key={uuidv4()} heading={2}>{title}</OLTitle>
}