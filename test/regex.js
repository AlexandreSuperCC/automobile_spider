let test = "he fdsf fsdf"
//console.log(test.split(''))  

let test2 = '    hes ljl sfqfqzef     \n'+'  dfs   \n'+'  sdfsd    \n'+'   sdf \n'+'   Échappement \n'
let reg = /[a-zA-Z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ](.*?)\n/igm
let arr = test2.match(reg)
let res = [] 
arr&&arr.forEach(e=>res.push(e.trim()))
//console.log(res)  


let test3 = '<a href="https://www.mister-auto.com/plaquette-de-frein/">Jeu de 4 plaquettes de frein avant</a> <!---->'
let reg1 = /href="(.*?)"/igm
let reg2 = />(.*?)<\/a>/igm

let res2 = reg1.exec(test3)[1]
let res3 = reg2.exec(test3)[1]

let hrefReg = /https.*"/igm
let urlPro = test3.match(hrefReg)

console.log(urlPro)  


