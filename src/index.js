import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import LarkDocBlogApp from './App'
import { Provider } from 'react-redux'
import standardCreateStore from './store/create'
import React, { Component } from 'react'
import axios  from './core/axios'

Component.prototype.axios = axios
const store = standardCreateStore()

ReactDOM.render((
<Provider store={store}>
    <React.StrictMode>
        <BrowserRouter>
            <LarkDocBlogApp/>
        </BrowserRouter>
    </React.StrictMode>
</Provider>), document.getElementById("root"))