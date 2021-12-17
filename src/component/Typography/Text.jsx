import { Typography, Row, Col } from '@douyinfe/semi-ui'
import React, { Component } from 'react'

export default class OLText extends Component {
    render() {
        const { Text } = Typography
        return (
            <div key={this.props.key}>
                <Text {...this.props}></Text>
            </div>
        )
    }
}
