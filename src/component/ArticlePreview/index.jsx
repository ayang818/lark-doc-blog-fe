import React, { Component, memo } from 'react'
import { Typography } from '@douyinfe/semi-ui';
import { IconTreeTriangleRight, IconTreeTriangleDown, IconSpin } from '@douyinfe/semi-icons';
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';
import './articlePreview.css'
import { getChildrenOrderedNodes } from '../../api';

// preview 不展示具体信息。不要走任何 parser
class ArticlePreview extends Component {

    state = {
        triangleClose: true,
        children: [
            // {
            //     create_time: 1639989160,
            //     doc_token: "doccnj1DnMZWnwOVqNUmnW6zJjQ",
            //     doc_type: "doc",
            //     has_child: false,
            //     latest_modify_time: 1639989163,
            //     node_type: "origin",
            //     parent_node_token: "wikcndh4C15HC8E0KStRAxRD3Tf",
            //     title: "Redux",
            //     wiki_token: "wikcn4UF22JHTNpjXvitvdgr641"
            // }
        ],
        loading: false
    }

    static propTypes = {
        title: PropTypes.string.isRequired,
        wikiToken: PropTypes.string.isRequired,
        docToken: PropTypes.string.isRequired,
        createTime: PropTypes.number.isRequired,
        modifyTime: PropTypes.number.isRequired,
        hasChild: PropTypes.bool,
        width: PropTypes.number
    }

    static defaultProps = {
        width: 1
    }

    changeTriangleCloseOrOpen = () => {
        const {wikiToken} = this.props
        const {triangleClose, children} = this.state
        // 收起子节点不请求后端
        if (triangleClose) {
            // 开始旋转
            if (children.length == 0) {
                this.setState({loading: true})
            } else {
                // 如果 children 已经有内容，直接展开，异步加载更新
                this.setState({triangleClose: false})
            }
            getChildrenOrderedNodes(wikiToken).then(
                resp => {
                    this.setState({children: resp, triangleClose: false, loading: false})
                }
            )
        } else {
            this.setState({triangleClose: true, loading: false})
        }
    }

    switchIcon = () => {
        const {loading, triangleClose} = this.state
        if (loading) {
            return <IconSpin className='triangleBackground' spin/>
        } else {
            if (triangleClose) {
                return <IconTreeTriangleRight className='triangleBackground hoverBackground' onClick={this.changeTriangleCloseOrOpen}/>
            } else {
                return <IconTreeTriangleDown className='triangleBackground hoverBackground' onClick={this.changeTriangleCloseOrOpen}/>
            }
        }
    }

    // TODO render 次数多
    render() {
        const {Title} = Typography
        const {title, wikiToken, hasChild, width} = this.props
        const { triangleClose, children } = this.state
        return (
            <div style={{width: `${width * 100}%`, marginLeft: `${(1-width)*100}%`}}>
                <div className='article-border'>
                    <div className='flex-inline'>
                        {hasChild ? 
                        this.switchIcon()
                        : ""}
                        <Link style={{textDecoration: 'none'}} to={`/article/${wikiToken}`} key={wikiToken}><Title heading={4}>{title}</Title></Link>
                    </div>
                </div>
                <div>
                    {
                        hasChild && !triangleClose ? 
                        children.map(child => {
                            const {doc_token:docToken, title, create_time:createTime, wiki_token:wikiToken, latest_modify_time:modifyTime, has_child:hasChild} = child
                            return <ArticlePreview key={wikiToken} wikiToken={wikiToken} docToken={docToken} createTime={createTime} modifyTime={modifyTime} title={title} hasChild={hasChild} width={0.9}></ArticlePreview>
                        })
                        :
                        ""
                    }
                </div>
            </div>
        )
    }
}

export default memo(ArticlePreview)