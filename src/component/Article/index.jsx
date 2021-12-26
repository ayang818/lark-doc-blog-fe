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
        wikiToken: '',
        catalogue: [],
        catalogueDom: [],
        catalogueRendered: false
    }

    static propsTypes = {
        wikiToken: PropTypes.string,
        direct: PropTypes.bool
    }

    static defaultProps = {
        // 是否直接使用 props 传入的 wikiToken
        direct: false
    }

    initUpdateCatalogueActiveStatusEvent = () => {
        // 注册窗口滚动监听事件
        window.onscroll = () => {
            let {catalogueDom, catalogue} = this.state
            let len = catalogueDom.length
            let scrollTop =  document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
            let activeTitleIdx = -1
            for (let i = 0; i < len; i++) {
                let dom = catalogueDom[i]
                console.log(dom.offsetTop, scrollTop)
                let offset = dom.offsetTop - scrollTop
                if (offset > 20) {
                    break
                }
                activeTitleIdx = i
            }
            if (activeTitleIdx !== -1) {
                // clear active status
                for (let item of catalogue) {
                    item.active = false
                }
                catalogue[activeTitleIdx].active = true
            }
            this.setState({catalogue})
        }
    }

    componentDidMount = () => {
        this.initUpdateCatalogueActiveStatusEvent()
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
        // this.setState({wikiToken})
        // 拿到文章的 json 内容解析并放到 state
        getNodeContent(wikiToken).then(
            resp => {
                let article = resp.data
                let content = JSON.parse(article.content)
                let titleVdom = parseTitle(content)
                let bodyVdom = parseBody(content)
                this.setState({titleVdom, bodyVdom, wikiToken})
            },
            err => {
                console.error(err)
            }
        )
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
            console.log('item', newItem)
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
        if (!this.state.catalogueRendered) {
            // 生成目录
            let catalogueItems = document.getElementsByClassName('v-title')
            console.log(catalogueItems)
            let catalogue = []
            for (let item of catalogueItems) {
                let res = item.className.split(' ').filter((item) => {
                    return item.search('title-level-') !== -1
                })
                let levelClassName = res[0]
                let level = Number(levelClassName.charAt(levelClassName.length - 1))
                let text = item.innerText
                let id = item.id
                catalogue.push({level, text, marginLeft: 0, id, active: false})
            }
            catalogue = this.calcCatalogueItemMarginLeft(catalogue)
            this.setState({catalogue, catalogueRendered: true, catalogueDom: catalogueItems})
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
        const {titleVdom, bodyVdom, wikiToken, catalogue} = this.state
        return (
            <div >
                <Row gutter={{xs: 24, sm: 24, md: 24, lg: 24, xl: 24, xxl: 24}}>
                    <Col xs={3} sm={7} md={7} lg={7} xl={7} xxl={7}>
                        {
                            catalogue.length > 0 ? 
                            (<div className='catalogue-list'>
                            {
                                catalogue.map(item => {
                                    {/* TODO 这里的 id 不一样？ */}
                                    return <div>
                                    <Text className={`catalogue-level-${item.level}`} style={{marginLeft: `${item.marginLeft}em`}}>
                                        <a href={`#${item.id}`} className={`txt-nodeco ${item.active ? 'txt-active' : ''}`}>
                                            {item.text}
                                        </a>
                                    </Text><br/>
                                    </div>
                                })
                            }
                            </div>) :
                            <div></div>
                        }
                        
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