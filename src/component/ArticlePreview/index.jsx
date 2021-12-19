import React, { Component, memo } from 'react'
import { Col, Row } from '@douyinfe/semi-ui';
import { Typography } from '@douyinfe/semi-ui';
import PropTypes from 'prop-types'
import './articlePreview.css'
import { parseBody, parseTitle } from '../../core/parser';
import ReactDOM from 'react-dom'

// todo fix preview 不展示具体信息
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
        let bodyVdom = parseBody(article)
        // ReactDOM.render(bodyVdom, document.getElementById('body'+wikiToken))
    }

    // render 次数多
    render() {
        console.log('render')
        const { Text, Title, Paragraph } = Typography;
        const {article} = this.props
        const {id:wikiToken} = article
        console.log('article prop=', article)
        let titleVdom = parseTitle(article)
        let bodyVdom = parseBody(article)
        console.log(titleVdom)
        return (
            <div className='article-border'>
                <Row >
                    <Col span={0}></Col>
                    <Col span={24}>
                        <div className='prev-title'>
                            {
                                titleVdom
                            }
                        </div>
                        <div className='prev-body' id={'body'+wikiToken}>
                            {
                                bodyVdom
                            }
                        </div>
                    </Col>
                    <Col span={0}></Col>
                </Row>
            </div>
        )
    }
}

export default memo(ArticlePreview)