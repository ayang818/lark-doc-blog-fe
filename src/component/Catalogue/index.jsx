import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Col, Row, Typography } from '@douyinfe/semi-ui';
import './catalogue.css'
import { articleTopic } from '../../topic/topic';
import PubSub from 'pubsub-js'

export default class Catalogue extends Component {
    state = {
        catalogue: [],
        catalogueDom: []
    }

    static propTypes = {
        ellipsisMaxWidth: PropTypes.number,
    }

    static defaultProps = {
        ellipsisMaxWidth: 150,
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


    componentDidMount = () => {
        this.initUpdateCatalogueActiveStatusEvent()
        // this.token = PubSub.subscribe(articleTopic, this.renderCatalogue())
        this.token = PubSub.subscribe(articleTopic, (msg, data) => {
            let {catalogue, catalogueDom} = data
            if (catalogue) {
                this.setState({catalogue, catalogueDom})
            }
        })
    }

    componentWillUnmount = () => {
        PubSub.unsubscribe(this.token)
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
