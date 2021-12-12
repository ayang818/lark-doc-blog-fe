import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import LarkDocBlogApp from './App'
import { Provider } from 'react-redux'
import standardCreateStore from './store/create'

const store = standardCreateStore()

ReactDOM.render((
<Provider store={store}>
    <BrowserRouter>
        <LarkDocBlogApp/>
    </BrowserRouter>
</Provider>), document.getElementById("root"))