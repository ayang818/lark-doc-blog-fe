import axios from '../core/axios'

    
export const  getChildrenNodes = async (parentToken='default') => {
    let resp = await axios.get(`/node/${parentToken}/children`)
    return resp
}


export const getNodeContent = async (wikiToken) => {
    let resp = await axios.get(`/doc/${wikiToken}`)
    return resp
}

export const getDocsMetaData = async (tokenList) => {
    let resp = await axios.post(`/doc/metadata`, {req: tokenList})
    return resp
}