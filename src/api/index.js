import axios from '../core/axios'

    
export const  getChildrenNodes = async (parentToken='default') => {
    let resp = await axios.get(`/node/${parentToken}/children`)
    return resp
}


export const getNodeContent = (docToken) => {

}