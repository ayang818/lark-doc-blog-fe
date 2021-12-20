import React, { Component, memo } from 'react'
import { Col, Row } from '@douyinfe/semi-ui';
import { Typography } from '@douyinfe/semi-ui';
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';
import './articlePreview.css'

// todo fix preview 不展示具体信息
class ArticlePreview extends Component {

    static propTypes = {
        title: PropTypes.string.isRequired,
        wikiToken: PropTypes.string.isRequired,
        docToken: PropTypes.string.isRequired,
        createTime: PropTypes.number.isRequired,
        modifyTime: PropTypes.number.isRequired
    }

    // TODO render 次数多
    render() {
        const {Title} = Typography
        const {title, wikiToken} = this.props
        return (
            <div className='article-border'>
                <div>
                    <Link to={`/article/${wikiToken}`} key={wikiToken}><Title heading={4}>{title}</Title></Link>
                </div>
            </div>
        )
    }
}

export default memo(ArticlePreview)