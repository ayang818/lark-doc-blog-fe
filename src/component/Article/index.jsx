import React, { Component, memo } from 'react'
import { Col, Row, Typography } from '@douyinfe/semi-ui';
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

    static propsTypes = {
        wikiToken: PropTypes.string,
        direct: PropTypes.bool
    }

    static defaultProps = {
        // 是否直接使用 props 传入的 wikiToken
        direct: false
    }

    componentDidMount = () => {
        let {wikiToken, direct} = this.props
        console.log(this.props)
        // 如果不是直接传入 wikiToken，那就尝试去 url 去拿
        if (!direct) {
            let urlParams = window.location.href.split('/')
            let len = urlParams.length
            wikiToken = urlParams[len - 1]
            // 不要 ? 后面的param
            wikiToken = wikiToken.split('?')[0]
        }
        this.setState({wikiToken})
        // 拿到文章的 json 内容解析并放到 state
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

    componentDidUpdate = () => {
        console.log('update')
        let urlParams = window.location.href.split('/')
        let len = urlParams.length
        let wikiToken = urlParams[len - 1]
        // 不要 ? 后面的param
        wikiToken = wikiToken.split('?')[0]
        if (wikiToken !== this.state.wikiToken) {
            getNodeContent().then(
                resp => {
                    let article = resp.data
                    let content = JSON.parse(article.content)
                    let titleVdom = parseTitle(content)
                    let bodyVdom = parseBody(content)
                    this.setState({titleVdom, bodyVdom, wikiToken: 'wikcnojbE0C0j2C8tNgKdjOBqRh'})
                },
                err => {
                    console.error(err)
                }
            )
        }
    }

    // TODO render 次数多
    render() {
        // 强制 override 样式
        // TODO 为什么 index.css 的样式会被浏览器用户代理样式表覆盖呢？
        document.body.style.margin = '0'
        document.body.style.background = 'rgba(var(--semi-grey-0), 1)'
        document.body.style.overflowX = 'hidden'

        const {titleVdom, bodyVdom, wikiToken} = this.state
        return (
            <div >
                <Row>
                    <Col span={7}></Col>
                    <Col span={10} className='article-border'>
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