import React, { Component } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Article from './component/Article'
import BlogIndex from './page/BlogIndex'
import { Layout } from '@douyinfe/semi-ui'
import BlogNav from './component/BlogNav'


export default class LarkDocBlogApp extends Component {
    render() {
        const { Header, Content, Footer, Sider } = Layout
        return (
            <div>
                <Layout>
                    <Header>
                        <BlogNav></BlogNav>
                    </Header>
                    <Routes>
                        <Route path='' element={<Article id='-1' title='about'></Article>}></Route>
                        <Route path='blog' element={<BlogIndex></BlogIndex>}></Route>
                    </Routes>
                </Layout>
            </div>
        )
    }
}
