import React, { Component } from 'react'
import './index.css'
import { Typography, Row, Col } from '@douyinfe/semi-ui'
import Article from '../../component/Article';
import { getChildrenNodes, getNodeContent } from '../../api'

export default class BlogIndex extends Component {

    componentDidMount() {
        getChildrenNodes().then(
            resp => {console.log(resp.data)},
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
