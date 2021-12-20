import React, { Component, memo } from 'react'
import { Col, Row } from '@douyinfe/semi-ui';
import PropTypes from 'prop-types'
import './article.css'
import { parseBody, parseTitle } from '../../core/parser';
import { getNodeContent } from '../../api';

// todo fix preview 不展示具体信息
class Article extends Component {

    state = {
        titleVdom: '',
        bodyVdom: '',
        wikiToken: ''
    }

    componentDidMount = () => {
        let urlParams = window.location.href.split('/')
        let len = urlParams.length
        let wikiToken = urlParams[len - 1]
        this.setState({wikiToken})
        getNodeContent(wikiToken).then(
            resp => {
                let article = resp.data
                let content = JSON.parse(article.content)
                let titleVdom = parseTitle(content)
                let bodyVdom = parseBody(content)
                this.setState({titleVdom, bodyVdom})
            },
            err => {
                console.error(err)
            }
        )
    }

    // TODO render 次数多
    render() {
        const {titleVdom, bodyVdom, wikiToken} = this.state
        return (
            <div className='article-border'>
                <Row >
                    <Col span={7}></Col>
                    <Col span={10}>
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
                    <Col span={7}></Col>
                </Row>
            </div>
        )
    }
}

export default memo(Article)