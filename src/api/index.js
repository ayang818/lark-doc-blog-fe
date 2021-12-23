import axios from '../core/axios'

    
export const  getChildrenNodes = async (parentToken='default') => {
    let resp = await axios.get(`/node/${parentToken}/children`)
    return resp
}


export const getNodeContent = async (wikiToken='wikcnojbE0C0j2C8tNgKdjOBqRh') => {
    let resp = await axios.get(`/doc/${wikiToken}`)
    return resp
}

export const getDocsMetaData = async (tokenList) => {
    let resp = await axios.post(`/doc/metadata`, {req: tokenList})
    return resp
}

export const getChildrenOrderedNodes = async (parentToken='default') => {
    return getChildrenNodes(parentToken).then(
        resp => {
            let articles = resp.data.children
            // {
            //     doc_token: "doccnvdnC1ZafgRTm5ujxjDtjBf"
            //     doc_type: "doc"
            //     has_child: false
            //     node_type: "origin"
            //     parent_node_token: "wikcntksyciK6mP9jmsd6AYi28e"
            //     title: "困扰一年的前端问题排查经历"
            //     wiki_token: "wikcnvFapTea0i1ekiEyj3cnfRh"
            // }
            let articleDict = {}
            for (let article of articles) {
                articleDict[article.doc_token] = {
                    ...article
                }
            }
            let tokenList = []
            for (let article of articles) {
                tokenList.push({
                    docsToken: article.doc_token,
                    docsType: article.doc_type
                })
            }
            // 获取创建时间并排序
            return getDocsMetaData(tokenList).then(
                resp => {
                    let res = resp.data.docs_metas
                    let len = res.length
                    if (len >= 1) {
                        // 🐱炮排序，后创建的文件显示再在列表前面
                        for (let i = 0; i < len; i++) {
                            for (let j = 0; j < (len - i - 1); j++) {
                                if (res[j].create_time < res[j+1].create_time) {
                                    let tmp = res[j]
                                    res[j] = res[j+1]
                                    res[j+1] = tmp
                                }
                            } 
                        }
                    }
                    for (let i = 0; i < len; i++) {
                        let item = res[i]
                        let article = articleDict[item.docs_token]
                        res[i] = {
                            'create_time': item.create_time, 
                            'latest_modify_time': item.latest_modify_time, 
                            ...article
                        } 
                    }
                    return res
                },
                err => {
                    console.error(err)
                }
            )
        },
        err => {console.log(err)}
    )
}