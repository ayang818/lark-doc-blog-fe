import React, { Component } from 'react'
import { Typography } from '@douyinfe/semi-ui'

export default class Paragraph extends Component {
    render() {
        const { Paragraph } = Typography
        return (
            <div>
                {/* 这里不能加 {...this.props} 不然就会死循环 */}
                <Paragraph spacing='extended'></Paragraph>
            </div>
        )
    }
}
