import React, { Component } from 'react'
import { Col, Row } from '@douyinfe/semi-ui';
import { Typography } from '@douyinfe/semi-ui';

export default class Article extends Component {

    render() {
        if (this.props.id === '-1') {
            return this.aboutRender()
        }
        return (
            <div>
                article
            </div>
        )
    }

    aboutRender = () => {
        const { Text, Title } = Typography;
        return (
            <div style={{width: '100%', height: 'auto'}}>
            <Row>
                <Col span={7}></Col>
                <Col span={10}>
                    <Text>
                        👏Hello, welcome to my space.

                        🚩My name is Yang fengchang, graduated from  Hangzhou Dianzi University(杭州电子科技大学).<br/>
                        🐒I am a golang backend engineer, but not only backend, frontend. blockchain. desktop is what i am interested in.<br/>
                        💻I used to work as an intern at *bytedance ad* and *cainiao station*. <br/>
                        💡Now I`m working for *bytedance ad* as a official employee.<br/>
                        <br/>

                        How to reach me: 
                        <br/>
                        <ul> 
                        <li>📃email: yfc@ayang818.top </li>
                        </ul>
                    </Text>
                </Col>
                <Col span={7}></Col>
            </Row>
            </div>
        )
    }
}
