import React, { Component } from 'react'
import './index.css'
import { Typography, Row, Col } from '@douyinfe/semi-ui'
import ArticlePreview from '../../component/ArticlePreview';
import { getChildrenNodes, getNodeContent, getDocsMetaData } from '../../api'

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
        getChildrenNodes().then(
            resp => {
                let articles = resp.data.children
                // fetch every node detail, include create time, then order desc
                let articleList = []
                let tokenList = []
                for (let article of articles) {
                    tokenList.push({
                        docsToken: article.doc_token,
                        docsType: article.doc_type
                    })
                }
                getDocsMetaData(tokenList).then(
                    resp => {
                        let res = resp.data.docs_metas
                        let len = res.length
                        if (len >= 1) {
                            // 🐱炮排序，后创建的文件在前面
                            for (let i = 0; i < len; i++) {
                                for (let j = 0; j < (len - i - 1); j++) {
                                    if (res[i].create_time < res[i+1].create_time) {
                                        let tmp = res[i]
                                        res[i] = res[i+1]
                                        res[i+1] = tmp
                                    }
                                } 
                            }
                        }
                        for (let item of res) {
                            for (let article of articles) {
                                if (article.doc_token === item.docs_token) {
                                    item.wiki_token = article.wiki_token
                                    break
                                }
                            }
                        }
                        this.setState({articles: res})
                    },
                    err => {
                        console.error(err)
                    }
                )
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
                                const {docs_token:docToken, title, create_time:createTime, wiki_token:wikiToken, latest_modify_time:modifyTime} = article
                                return <ArticlePreview key={wikiToken} wikiToken={wikiToken} docToken={docToken} createTime={createTime} modifyTime={modifyTime} title={title}></ArticlePreview>
                            })
                        }
                        
                    </Col>
                    <Col span={7}></Col>
                </Row>
            </div>
        )
    }
}
