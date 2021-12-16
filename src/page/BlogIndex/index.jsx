import React, { Component } from 'react'
import './index.css'
import { Typography, Row, Col } from '@douyinfe/semi-ui'
import ArticlePreview from '../../component/ArticlePreview';
import { getChildrenNodes, getNodeContent } from '../../api'
import { parse } from '../../core/parser'

export default class BlogIndex extends Component {
    state = {
        articles: [],
    }

    componentDidMount() {
        getChildrenNodes().then(
            resp => {
                let articles = resp.data.children
                // fetch every node detail, include create time, then order desc
                let articleList = []
                for (let article of articles) {
                    getNodeContent(article.wiki_token).then(
                        articleDetailResp => {
                            let articleDetail = articleDetailResp.data
                            let revision = articleDetail.revision
                            let content = JSON.parse(articleDetail.content)
                            articleList.push({id: article.wiki_token, title: content.title, body: content.body})
                            this.setState({articles: articleList})
                        },
                        err1 => {
                            console.error(err1)
                        }
                    )
                }
            },
            err => {console.log(err)}
        )
    }

    render() {
        const { Text, Title } = Typography;
        return (
            <div>
                <Row>
                    <Col span={7}></Col>
                    <Col span={10}>
                        {
                            this.state.articles.map((article) => {
                                return <ArticlePreview key={article.id} article={article}></ArticlePreview>
                            })
                        }
                        
                    </Col>
                    <Col span={7}></Col>
                </Row>
            </div>
        )
    }
}
