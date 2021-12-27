import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { backendAddress } from '../../config'

export default class ImageShow extends Component {

    static propTypes = {
        width: PropTypes.number,
        height: PropTypes.number,
        fileToken: PropTypes.string.isRequired
    }    

    static defaultProps = {
        width: 1808,
        height: 952
    }

    retryTime = 0
    maxRetryTime = 3

    openBigImage = (e) => {
        const {width, height, fileToken} = this.props
        window.open(`${backendAddress}/download/${fileToken}`)
    }

    onErrorReload = (e) => {
        // 超时重试次数限制
        if (this.retryTime > this.maxRetryTime) {
            // TODO 换成加载失败的图片
            return
        }
        let {target} = e
        console.error(`reload token: ${this.props.fileToken}`)
        let src = target.src
        target.src = src + '?t=' + new Date().getTime()
        this.retryTime += 1
    }

    render() {
        const {width, height, fileToken} = this.props
        return (
            <div onClick={this.openBigImage}>
                <img style={{
                    textAlign: 'center',
                    // width: `${width}px`,
                    // height: `${height}px`
                    width: '100%'
                }} src={`${backendAddress}/download/${fileToken}`}
                onError={this.onErrorReload}></img>
            </div>
        )
    }
}
