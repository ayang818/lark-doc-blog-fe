import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Col, Row, Typography } from '@douyinfe/semi-ui';
import './catalogue.css'

export default class Catalogue extends Component {
    state = {
        catalogue: [],
        catalogueRendered: false,
        catalogueDom: []
    }

    static propTypes = {
        ellipsisMaxWidth: PropTypes.number,
        articleRendered: PropTypes.bool.isRequired,
    }

    static defaultProps = {
        ellipsisMaxWidth: 150,
        articleRendered: false
    }

    // 初始化 更新目录激活状态 的滚动监听事件
    initUpdateCatalogueActiveStatusEvent = () => {
        // 注册窗口滚动监听事件
        window.onscroll = () => {
            let {catalogueDom, catalogue} = this.state
            let len = catalogueDom.length
            let scrollTop =  document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
            let activeTitleIdx = -1
            for (let i = 0; i < len; i++) {
                let dom = catalogueDom[i]
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
                let vdom = catalogue[activeTitleIdx]
                if (vdom) {
                    catalogue[activeTitleIdx].active = true
                }
            }
            this.setState({catalogue})
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

    componentDidMount = () => {
        this.initUpdateCatalogueActiveStatusEvent()
        this.renderCatalogue()
    }

    componentDidUpdate = () => {
        this.renderCatalogue()
    }

    // 渲染 目录 结构
    renderCatalogue = () => {
        const {articleRendered} = this.props
        console.log('articleRendered',articleRendered)
        // 如果 article 还没有解析好，那就先不渲染
        if (!articleRendered) {
            this.setState({catalogue: [], catalogueItems: []})
            return
        }
        // 目录已经渲染过
        if (this.state.catalogueRendered) return
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
        this.setState({catalogue, catalogueRendered: true, catalogueDom: catalogueItems})
    }

    render() {
        const {catalogue} = this.state
        const { Text } = Typography
        return (
            <div>
                {
                    catalogue.length > 0 ? 
                    (<div className='catalogue-list'>
                    {
                        catalogue.map(item => {
                            {/* TODO 这里的 link-id 不一样？ */}
                            return <div style={{padding: '4px 0 4px 0'}}>
                            <Text style={{marginLeft: `${item.marginLeft}em`}} ellipsis={{ 
                                showTooltip:{
                                    opts: { content: item.text }
                                }
                            }}
                            style={{ width: 150 }}>
                                <a href={`#${item.id}`} className={`txt-nodeco ${item.active ? 'txt-active' : ''}`}>
                                    {item.text}
                                </a>
                            </Text><br/>
                            </div>
                        })
                    }
                    </div>) :
                    ''
                }
            </div>
        )
    }
}
