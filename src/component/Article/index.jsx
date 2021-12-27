import React, { Component, memo } from 'react'
import { Col, Row, Typography } from '@douyinfe/semi-ui';
import PropTypes from 'prop-types'
import './article.css'
import { parseBody, parseTitle } from '../../core/parser';
import { getNodeContent } from '../../api';
import Catalogue from '../Catalogue';
import PubSub from 'pubsub-js';
import { articleTopic } from '../../topic/topic';

// todo fix preview 不展示具体信息
class Article extends Component {

    state = {
        titleVdom: '',
        bodyVdom: '',
        wikiToken: '',
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
                // setState 异步，会有bug
                this.setState({titleVdom, bodyVdom, wikiToken})
                console.log("article rendered finished")
            },
            err => {
                console.error(err)
            }
        )
    }

    componentDidMount = () => {
        console.log('article mount')
        let {wikiToken, direct} = this.props
        // 如果不是直接传入 wikiToken，那就尝试去 url 去拿
        if (!direct) {
            wikiToken = this.getWikiTokenFromUrl()
        }
        this.getDocContent(wikiToken)
    }

    componentDidUpdate = () => {
        console.log('article update')
        let wikiToken = this.getWikiTokenFromUrl()
        if (!wikiToken) {
            let {wikiToken:token} = this.props
            if (token) {
                wikiToken = token
            } else {
                console.error('wikiToken 不得为空!')
                return
            }
        }
        // 如果是 direct ，第一次进到这里后，wikiToken 应该是空的，getDocContent 会设置好
        // 强制刷新
        if (wikiToken !== this.state.wikiToken) {
            this.getDocContent(wikiToken)
        }
        let {catalogue, catalogueItems:catalogueDom} = this.renderCatalogue()
        // 不通过 setState 下传，通过 PubSub 解耦
        PubSub.publish(articleTopic, {
            catalogue,
            catalogueDom
        })
    }

    // TODO render 次数多
    render() {
        // 强制 override 样式
        // TODO 为什么 index.css 的样式会被浏览器用户代理样式表覆盖呢？
        document.body.style.margin = '0'
        document.body.style.background = 'rgba(var(--semi-grey-0), 1)'
        document.body.style.overflowX = 'hidden'
        const { Text } = Typography
        const {titleVdom, bodyVdom, wikiToken} = this.state
        return (
            <div >
                <Row gutter={{xs: 24, sm: 24, md: 24, lg: 24, xl: 24, xxl: 24}}>
                    <Col xs={3} sm={7} md={7} lg={7} xl={7} xxl={7}>
                        <Catalogue></Catalogue>
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

    // 渲染 目录 结构
    renderCatalogue = () => {
        // 生成目录
        let catalogueItems = document.getElementsByClassName('v-title')
        let catalogue = []
        for (let i =0;i<catalogueItems.length; i++) {
            let item = catalogueItems[i]
        // for (let item of catalogueItems) {
            let res = item.className.split(' ').filter((item) => {
                return item.search('title-level-') !== -1
            })
            let levelClassName = res[0]
            let level = Number(levelClassName.charAt(levelClassName.length - 1))
            let text = item.innerText
            let id = item.id
            let active = i == 0 ? true : false
            catalogue.push({level, text, marginLeft: 0, id, active})
        }
        catalogue = this.calcCatalogueItemMarginLeft(catalogue)
        return {
            catalogue, 
            catalogueItems
        }
    }

    calcCatalogueItemMarginLeft = (catalogue) => {
        // 标题offset计算算法 O(n^2)
        // 每一位向前扫描，
        // 如果有相同的；那么 同步margin。
        // 如果没有相同；
        // 若新level最小或中等，将所有 level > 新 level 的 margin + 1
        // 若新level最大，拿当前level最大的 margin + 1
        let len = catalogue.length
        let biggestLevelPair =  {
            level: -1,
            marginLeft: 0
        }
        for (let i = 0; i < len; i++) {
            let newItem = catalogue[i]
            if (i !== 0) {
                for (let j = 0; j < i; j++) {
                    let compareItem = catalogue[j]
                    if (newItem.level === compareItem.level) {
                        newItem.marginLeft = compareItem.marginLeft
                        catalogue[i] = newItem
                        break
                    } else if (newItem.level < compareItem.level) {
                        compareItem.marginLeft += 1
                        catalogue[j]= compareItem
                    }
                }
            }
            if (newItem.level > biggestLevelPair.level) {
                if (biggestLevelPair.level != -1) {
                    newItem.marginLeft = biggestLevelPair.marginLeft + 1
                }
                biggestLevelPair = {
                    level: newItem.level,
                    marginLeft: newItem.marginLeft
                }
            }
            catalogue[i] = newItem
        }
        return catalogue
    }
}

export default memo(Article)