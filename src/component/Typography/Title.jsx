import { Typography, Row, Col } from '@douyinfe/semi-ui'
import React, { Component } from 'react'
import PropTypes from 'prop-types'


export default class Title extends Component {
    static propTypes = {
        heading: PropTypes.number
    }

    static defaultProps = {
        heading: 2
    }

    render() {
        const {Title} = Typography
        return (
            <div>
                <Title heading={this.props.heading} {...this.props}></Title>
            </div>
        )
    }
}
