import React, { Component } from 'react'
import './index.css'
import { Typography, Row, Col } from '@douyinfe/semi-ui'
import ArticlePreview from '../../component/ArticlePreview';
import { getChildrenOrderedNodes } from '../../api'

export default class BlogIndex extends Component {
    state = {
        articles: [
            {
                docs_token: "doc22222",
                docs_type: "doc",
                title: "waiting~", 
                owner_id: "12345", 
                create_time: 123456, 
                latest_modify_user: "12345", 
                latest_modify_time: 123456,
                wiki_token: ''
            }
        ],
    }

    componentDidMount() {
        // 获取根下所有 wiki
        // TODO 如何排序？
        getChildrenOrderedNodes().then(resp => {
            this.setState({articles: resp})
        })
    }

    render() {
        const { Text, Title } = Typography;
        return (
            <div>
                <Row gutter={{xs: 24, sm: 24, md: 24, lg: 24, xl: 24, xxl: 24}}>
                    <Col xs={3} sm={7} md={7} lg={7} xl={7} xxl={7}></Col>
                    <Col xs={18} sm={10} md={10} lg={10} xl={10} xxl={10}>
                        {
                            this.state.articles.map((article) => {
                                const {doc_token:docToken, title, create_time:createTime, wiki_token:wikiToken, latest_modify_time:modifyTime, has_child:hasChild} = article
                                return <ArticlePreview key={wikiToken} wikiToken={wikiToken} docToken={docToken} createTime={createTime} modifyTime={modifyTime} title={title} hasChild={hasChild}></ArticlePreview>
                            })
                        }
                        
                    </Col>
                    <Col xs={3} sm={7} md={7} lg={7} xl={7} xxl={7}></Col>
                </Row>
            </div>
        )
    }
}
