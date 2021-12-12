import { createStore, combineReducers } from 'redux'

export default () => {
    let reducerFuncs = combineReducers({

    })
    return createStore(reducerFuncs)
}