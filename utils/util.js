function getNewId(){
    return Math.round(Math.random() * 100000000)
}
/**
 * in: '    hes ljl sfqfqzef     \n'+'  dfs   \n'+'  sdfsd    \n'+'   sdf \n'+'   Échappement \n'
 * out: ['res1','res2'...]
 * @param {*} inArr 
 * @returns Array
 */
function getPurlDataArr(inArr){
    let regex = /[a-zA-Z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ](.*?)\n/igm
    let arrSpace = inArr.match(regex)
    let resArr = []
    arrSpace&&arrSpace.forEach(e=>resArr.push(e.trim()))
    return resArr;
}
/**
 * + &
 * @param {*} inArr 
 * @returns 
 */
function getPurlDataArrWithSpace(inArr){
    let regex = /[a-zA-Z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ&](.*?)\n/igm
    let arrSpace = inArr.match(regex)
    let resArr = []
    arrSpace&&arrSpace.forEach(e=>resArr.push(e.trim()))
    return resArr;
}

module.exports = {
    getNewId:getNewId,
    getPurlDataArr:getPurlDataArr,
    getPurlDataArrWithSpace:getPurlDataArrWithSpace
}


