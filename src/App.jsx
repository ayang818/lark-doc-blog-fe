import React, { Component } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Article from './component/Article'
import BlogIndex from './page/BlogIndex'
import { Layout } from '@douyinfe/semi-ui'
import BlogNav from './component/BlogNav'


export default class LarkDocBlogApp extends Component {
    state = {
        isLight: true
    }

    changeShowMode = () => {
        const body = document.body;
        if (body.hasAttribute('theme-mode')) {
            body.removeAttribute('theme-mode');
            this.setState({isLight: true})
        } else {
            body.setAttribute('theme-mode', 'dark');
            this.setState({isLight: false})
        }
    }

    render() {
        const { Header, Content, Footer, Sider } = Layout
        return (
            <div>
                <Layout>
                    <Header>
                        <BlogNav changeShowMode={this.changeShowMode} isLight={this.state.isLight}></BlogNav>
                    </Header>
                    <Routes>
                        <Route path='' element={<Article article={{id: 'wikcnojbE0C0j2C8tNgKdjOBqRh'}}></Article>}></Route>
                        <Route path='blog' element={<BlogIndex></BlogIndex>}></Route>
                        <Route path='article/:wikiToken' element={<Article></Article>}></Route>
                    </Routes>
                </Layout>
            </div>
        )
    }
}
