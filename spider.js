const mysql = require("./mysql/lcMysql")
const sqlQuery = require("./mysql/lcMysql");
const axios = require("axios")
const cheerio = require("cheerio")
const {getNewId,getPurlDataArr,getPurlDataArrWithSpace} = require("./utils/util")
const async = require('async');


const index_url = "https://www.mister-auto.com/freinage/"

process.on('unhandledRejection', error => {
    console.log('i help you handler it: ', error.message);
   });

async function spiderCategory(){
    let res = await axios.get(index_url)
    let $ = cheerio.load(res.data)
    let top_cat_label = $("#content-page > div.listing-template.misterauto > div > div.listing-container.grid-12-12.grid-template > div.grid-3-12 > div > ul > li > label").text()
    const sysArr = getPurlDataArr(top_cat_label)
    /* got all the categories */
    sysArr.forEach((e,index)=>{
        let sysId = index+1
        let strSql = "insert into t_systeme(id, name, ts) values(?,?,now());"
        let arr = [sysId,e]
        sqlQuery(strSql, arr)
        console.log("insert le système ["+e+"] with id ["+sysId+"] avec succès")  
        doPiece(sysId)
    })

}
/**
 * 
 * @param {*} sysId which children of the parent element, start from 1
 */
async function doPiece(sysId){
    let res = await axios.get(index_url)
    let $ = cheerio.load(res.data)
    const piece_labelArr = $("#content-page > div.listing-template.misterauto > div > div.listing-container.grid-12-12.grid-template > div.grid-3-12 > div > ul > li:nth-child("+sysId+") > ul > li > label").text()
    const pieceArr =getPurlDataArr(piece_labelArr)
    pieceArr.forEach((e,index)=>{
        let piecePosInCurSys = index+1
        let pieceId = getNewId();
        let strSql = "insert into t_piece(id, name, ts, vdef1, sid) values(?,?,now(),?,?);"
        let arr = [pieceId,e,piecePosInCurSys,sysId]
        sqlQuery(strSql, arr)
        console.log("insert le piece ["+e+"] with id ["+pieceId+"] avec succès")  
        doPieceDetaillee(piecePosInCurSys,pieceId,sysId)
    })
}
async function doPieceDetaillee(piecePosInCurSys,pieceId,sysId){
    let res = await axios.get(index_url)
    let $ = cheerio.load(res.data)
    let pieceDetailHTMLArr = $("#content-page > div.listing-template.misterauto > div > div.listing-container.grid-12-12.grid-template > div.grid-3-12 > div > ul > li:nth-child("+sysId+") > ul > li:nth-child("+piecePosInCurSys+") > ul > li > label ")
    pieceDetailHTMLArr.each((index, Element)=>{
        let urlStr = $(Element).html()
        let hrefReg = /href="(.*?)"/igm//match all href="(.*?)" => bug use: UPDATE t_piece_detaillee SET vdef1= REPLACE(vdef1,'"','') where vdef1 != '';
        let urlPro = urlStr.match(hrefReg)
        if(!urlPro){//anti spider
            urlPro=''
        }
        let obj = {        
            url : urlPro,
            name : getPurlDataArr($(Element).text()),
        }
        let pieceDetId = getNewId();
        let strSql = "insert into t_piece_detaillee(id, name, ts, vdef1, pid) values(?,?,now(),?,?);"
        let arr = [pieceDetId,obj.name,obj.url,pieceId]
        sqlQuery(strSql, arr)
        console.log('insert the current piece detaillé of piece ['+pieceId+'] is: name['+obj.name+'], product href ['+obj.url+'] avec succès')
    })
}
//spiderCategory()

async function spiderProduit(){

    async.waterfall([
        function(passFunc) {
            let strSql = "select id,vdef1 from t_produit;"
            sqlQuery(strSql).then((res)=>{
                passFunc(null, res);
            })
        },
        function(prodArr, passFunc) {
            prodArr.forEach(async (e)=>{
                let res = await axios.get(e.vdef1)
                let $ = cheerio.load(res.data)
                let name = getPurlDataArr($("#name-product-page").text())[0]
                let imgUrl = $("#product-item-main-container > section > div.card-block.grid-template.grid-12-12 > div > section.product-card-pictures.grid-6-12 > div > div > div > div > img").attr('src').trim()
                let price = getPurlDataArr($("#product-listing-item > div.ma-price > div.price > span").text())[0]
                let marqueArr = getPurlDataArrWithSpace($("#name-product-page > div").text())
                let marque = marqueArr[0]+marqueArr[1]
    
                let strSql = "update t_produit set name=?,img_url=?,price=?,status=?,marque=?,ts=now() where id=?;"
                let arr = [name,imgUrl,price,0,marque,e.id]
                console.log('update the product: ['+name+'] avec succès')
    
                sqlQuery(strSql, arr)
                
    
                 let commentArr = $("#collapse-reviewset > div > div.ais-Hits > ol > li > div")
                 commentArr.each((index, Element)=>{
                    try {
                        let time = $(Element).find('.text-sm.font-bold').text().trim()
                        let authorName = $(Element).find('.reviews-info > p:nth-child(2)').text().trim()
                        let purpose = 'Pièce achetée pour ' + $(Element).find('.mt-sm.text-xxs > span').text().trim()
                        let comment = $(Element).find('.reviews-content > p.text-sm').text().trim()
                        let commentId = getNewId();
                        let strSql = "insert into t_comment(id,author_name,content,time,purpose,ts, pid) values(?,?,?,?,?,now(),?);"
                        let arr = [commentId,authorName,comment,time,purpose,e.id]
                        sqlQuery(strSql, arr)
                  
                        console.log('insert the comment of product ['+e.id+'] is: time['+time+'] avec succès') 
                    } catch (error) {
                        console.log(error)
                    }
              
                })
            })
        },
    ], function(err, result) {
        if (err) {
            console.log(err);
        } else {
            
        }
    });





}
spiderProduit()


























async function test(){
    let piecePosInCurSys = 1
    let sysId = 3
    let res = await axios.get(index_url)
    let $ = cheerio.load(res.data)
    let pieceDetailHTMLArr = $("#content-page > div.listing-template.misterauto > div > div.listing-container.grid-12-12.grid-template > div.grid-3-12 > div > ul > li:nth-child("+sysId+") > ul > li:nth-child("+piecePosInCurSys+") > ul > li > label ")
    pieceDetailHTMLArr.each((index, Element)=>{
        let urlStr = $(Element).html()
        let hrefReg = /href="(.*?)"/igm
        let urlPro = urlStr.match(hrefReg)
        if(!urlPro){
            urlPro=''
        }
        let obj = {        
            url : urlPro,
            name : getPurlDataArr($(Element).text()),
        }
        console.log(obj.url+':'+obj.name)

        //pieceDetailObj.push(obj)
    })


}


