import React, { Component } from 'react'
import PropTypes from 'prop-types'


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

    openBigImage = (e) => {
        const {width, height, fileToken} = this.props
        window.open(`http://localhost:5000/download/${fileToken}`)
    }

    onErrorReload = (e) => {
        let {target} = e
        console.error(`reload token: ${this.props.fileToken}`)
        let src = target.src
        target.src = src + '?t=' + new Date().getTime()
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
                }} src={`http://localhost:5000/download/${fileToken}`}
                onError={this.onErrorReload}></img>
            </div>
        )
    }
}
