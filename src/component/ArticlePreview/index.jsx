import React, { Component, memo } from 'react'
import { Col, Row } from '@douyinfe/semi-ui';
import { Typography } from '@douyinfe/semi-ui';
import PropTypes from 'prop-types'
import './articlePreview.css'
import { parseBody, parseTitle } from '../../core/parser';
import ReactDOM from 'react-dom'


class ArticlePreview extends Component {

    state = {
        title: <h2>Null Title</h2>,
    }

    static propTypes = {
        article: PropTypes.object
    }    

    static defaultProps = {
        article: {}
    }
    
    componentDidMount() {
        const {article} = this.props
        const {id:wikiToken} = article
        let titleParsed = parseTitle(article)
        this.setState({title: titleParsed})
        // console.log('parse article res;', parse(article))
        ReactDOM.render(titleParsed, document.getElementById(wikiToken))
    }

    // render 次数多
    render() {
        console.log('render')
        const { Text, Title, Paragraph } = Typography;
        const {article} = this.props
        const {id:wikiToken} = article
        console.log('article prop=', article)
        return (
            <div className='article-border'>
                <Row >
                    <Col span={0}></Col>
                    <Col span={24}>
                        <div id={wikiToken}>
                        </div>
                        <Paragraph spacing='extended'>
                        </Paragraph>
                    </Col>
                    <Col span={0}></Col>
                </Row>
            </div>
        )
    }
}

export default memo(ArticlePreview)