import React, { Component } from 'react'
import './index.css'
import { Typography, Row, Col } from '@douyinfe/semi-ui'
import Article from '../../component/Article';
import { getChildrenNodes, getNodeContent } from '../../api'

export default class BlogIndex extends Component {
    state = {
        articles: []
    }

    componentDidMount() {
        getChildrenNodes().then(
            resp => {
                console.log(resp.data)
                let articles = resp.data.children
                // fetch every node detail, include create time, then order desc
                for (let article of articles) {
                    getNodeContent(article.wiki_token).then(
                        articleDetailResp => {
                            let articleDetail = articleDetailResp.data
                            let revision = articleDetail.revision
                            let content = articleDetail.content
                            console.log(content, revision)
                        },
                        err1 => {
                            console.log(err1)
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
                        <Article preview={true}></Article>
                        <Article preview={true}></Article>
                        <Article preview={true}></Article>
                        <Article preview={true}></Article>
                        <Article></Article>
                        <Article></Article>
                    </Col>
                    <Col span={7}></Col>
                </Row>
            </div>
        )
    }
}
