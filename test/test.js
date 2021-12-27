let res = [1,4,2,3]
let len = res.length
for (let i = 0; i < len - 1; i++) {
    for (let j = 0; j < (len - i - 1); j++) {
        if (res[j] < res[j+1]) {
            let tmp = res[j]
            res[j] = res[j+1]
            res[j+1] = tmp
        }
    } 
}
console.log(res)