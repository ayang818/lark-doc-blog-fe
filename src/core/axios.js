import axios from "axios"

axios.defaults.baseURL = 'http://localhost:5000'
axios.defaults.timeout = 10000
// // customer header
// axios.defaults.headers['custom-defined-header-key'] = 'custom-defined-header-value'
// // 自定义请求头：对所有请求方法生效
// axios.defaults.headers.common['common-defined-key-b'] = 'custom value: for all methods'
// // 自定义请求头：只对post方法生效
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
// // 自定义请求头：只对get方法生效
// axios.defaults.headers.get['get-custom-key'] = 'custom value: only for get method';

export default axios