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
        catelogue: [],
        catelogueRendered: false
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
        if (!this.state.catelogueRendered) {
            // 生成目录
            let catelogueItems = document.getElementsByClassName('v-title')
            console.log(catelogueItems)
            let catelogue = []
            for (let item of catelogueItems) {
                let res = item.className.split(' ').filter((item) => {
                    return item.search('title-level-') !== -1
                })
                let levelClassName = res[0]
                let level = Number(levelClassName.charAt(levelClassName.length - 1))
                let text = item.innerText
                catelogue.push({level, text, marginLeft: 0})
            }
            // 标题offset计算算法 O(n^2)
            // 每一位向前扫描，
            // 如果有相同的；那么 同步margin。
            // 如果没有相同；
            // 若新level最小或中等，将所有 level > 新 level 的 margin + 1
            // 若新level最大，拿当前level最大的 margin + 1
            let len = catelogue.length
            let biggestLevelPair =  {
                level: -1,
                marginLeft: 0
            }
            for (let i = 0; i < len; i++) {
                let newItem = catelogue[i]
                console.log('item', newItem)
                if (i !== 0) {
                    for (let j = 0; j < i; j++) {
                        let compareItem = catelogue[j]
                        if (newItem.level === compareItem.level) {
                            newItem.marginLeft = compareItem.marginLeft
                            catelogue[i] = newItem
                            break
                        } else if (newItem.level < compareItem.level) {
                            compareItem.marginLeft += 1
                            catelogue[j]= compareItem
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
                catelogue[i] = newItem
            }
            this.setState({catelogue, catelogueRendered: true})
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
        const {titleVdom, bodyVdom, wikiToken, catelogue} = this.state
        return (
            <div >
                <Row gutter={{xs: 24, sm: 24, md: 24, lg: 24, xl: 24, xxl: 24}}>
                    <Col xs={3} sm={7} md={7} lg={7} xl={7} xxl={7}>
                        <div style={{position: 'fixed', top: '20%', left: '20px'}}>
                            {
                                catelogue.map(item => {
                                    return <div>
                                    <Text className={`catelogue-level-${item.level}`} style={{marginLeft: `${item.marginLeft}em`}}>{item.text}</Text><br/>
                                    </div>
                                })
                            }
                        </div>
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