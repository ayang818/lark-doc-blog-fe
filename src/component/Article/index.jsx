import React, { Component, memo } from 'react'
import { Col, Row, Typography } from '@douyinfe/semi-ui';
import PropTypes from 'prop-types'
import './article.css'
import { parseBody, parseTitle } from '../../core/parser';
import { getNodeContent } from '../../api';
import Catalogue from '../Catalogue';

// todo fix preview 不展示具体信息
class Article extends Component {

    state = {
        titleVdom: '',
        bodyVdom: '',
        wikiToken: '',
        rendered: false
    }

    static propsTypes = {
        wikiToken: PropTypes.string,
        direct: PropTypes.bool
    }

    static defaultProps = {
        // 是否直接使用 props 传入的 wikiToken
        direct: false
    }


    getWikiTokenFromUrl = () => {
        let urlParams = window.location.href.split('/')
        let len = urlParams.length
        let wikiToken = urlParams[len - 1]
        // 不要 ? 和 # 后面的param
        wikiToken = wikiToken.split('?')[0].split('#')[0]
        return wikiToken
    }

    getDocContent = (wikiToken='wikcnojbE0C0j2C8tNgKdjOBqRh') => {
        // 拿到文章的 json 内容解析并放到 state
        getNodeContent(wikiToken).then(
            resp => {
                let article = resp.data
                let content = JSON.parse(article.content)
                let titleVdom = parseTitle(content)
                let bodyVdom = parseBody(content)
                this.setState({titleVdom, bodyVdom, wikiToken, rendered: true})
                console.log("article rendered finished")
            },
            err => {
                console.error(err)
            }
        )
    }

    componentDidMount = () => {
        let {wikiToken, direct} = this.props
        // 如果不是直接传入 wikiToken，那就尝试去 url 去拿
        if (!direct) {
            wikiToken = this.getWikiTokenFromUrl()
        }
        // this.setState({wikiToken})
        this.getDocContent(wikiToken)
    }

    
    componentDidUpdate = () => {
        console.log('update view')
        let wikiToken = this.getWikiTokenFromUrl()
        let { direct } = this.props
        // 切换界面，强制 reload
        if ((direct && this.state.wikiToken) || (!direct && wikiToken !== this.state.wikiToken)) {
            this.getDocContent()
        }
    }

    // TODO render 次数多
    render() {
        // 强制 override 样式
        // TODO 为什么 index.css 的样式会被浏览器用户代理样式表覆盖呢？
        document.body.style.margin = '0'
        document.body.style.background = 'rgba(var(--semi-grey-0), 1)'
        document.body.style.overflowX = 'hidden'
        const { Text } = Typography
        const {titleVdom, bodyVdom, wikiToken, rendered} = this.state
        return (
            <div >
                <Row gutter={{xs: 24, sm: 24, md: 24, lg: 24, xl: 24, xxl: 24}}>
                    <Col xs={3} sm={7} md={7} lg={7} xl={7} xxl={7}>
                        <Catalogue articleRendered={rendered}></Catalogue>
                    </Col>
                    <Col xs={18} sm={10} md={10} lg={10} xl={10} xxl={10} className='article-border'>
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
                    <Col xs={3} sm={7} md={7} lg={7} xl={7} xxl={7}></Col>
                </Row>
            </div>
        )
    }
}

export default memo(Article)