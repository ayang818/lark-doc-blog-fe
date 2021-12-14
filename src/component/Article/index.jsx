import React, { Component } from 'react'
import { Col, Row } from '@douyinfe/semi-ui';
import { Typography } from '@douyinfe/semi-ui';
import PropTypes from 'prop-types'
import './article.css'

export default class Article extends Component {

    state = {
        title: '/* Null Title */'
    }

    static propTypes = {
        preview: PropTypes.bool
    }    

    static defaultProps = {
        preview: false
    }

    render() {
        const { Text, Title, Paragraph } = Typography;
        const { preview:isPreviewMode } = this.props
        if (this.props.id === '-1') {
            return this.aboutRender()
        }
        return (
            <div className='article-border'>
                <Row >
                    <Col span={isPreviewMode ? 0 : 7}></Col>
                    <Col span={isPreviewMode ? 24 : 10}>
                        <Title heading={3}>
                            {this.state.title}
                        </Title>
                        <Paragraph spacing='extended'>
                            👏Hello, welcome to my space.

                            🚩My name is Yang fengchang, graduated from  Hangzhou Dianzi University(杭州电子科技大学).<br/>
                            🐒I am a golang backend engineer, but not only backend, frontend. blockchain. desktop is what i am interested in.<br/>
                            💻I used to work as an intern at *bytedance ad* and *cainiao station*. <br/>
                            💡Now I`m working for *bytedance ad* as a official employee.<br/>
                            <br/>

                            How to reach me: 
                            <br/>
                            <li>📃email: yfc@ayang818.top </li>
                        </Paragraph>
                    </Col>
                    <Col span={isPreviewMode ? 0 : 7}></Col>
                </Row>
                

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
