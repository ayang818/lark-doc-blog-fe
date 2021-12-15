import axios from '../core/axios'

    
export const  getChildrenNodes = async (parentToken='default') => {
    let resp = await axios.get(`/node/${parentToken}/children`)
    return resp
}


export const getNodeContent = async (docToken) => {
    let resp = await axios.get(`/doc/${docToken}`)
    return resp
}