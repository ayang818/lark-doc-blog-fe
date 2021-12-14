import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import LarkDocBlogApp from './App'
import { Provider } from 'react-redux'
import standardCreateStore from './store/create'
import { Component } from 'react'
import axios  from './core/axios'

Component.prototype.axios = axios
const store = standardCreateStore()

ReactDOM.render((
<Provider store={store}>
    <BrowserRouter>
        <LarkDocBlogApp/>
    </BrowserRouter>
</Provider>), document.getElementById("root"))