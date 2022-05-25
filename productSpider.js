let puppeteer = require('puppeteer');
const async = require('async');
const sqlQuery = require('./mysql/lcMysql');
const {getNewId,getPurlDataArr} = require("./utils/util")

const debugOptions = {
    defaultViewport:{
        width:1400,
        height:800,
        slowMo:250
    },
    headless:false,
    timeout:0
}
const provideOptions = {
    headless:true,
    timeout:0
}
function lcWait(milleSecondes){
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve("成功执行延迟函数, 延迟: "+milleSecondes)
        }, milleSecondes)
    })
}


function spiderProduit(){
    process.setMaxListeners(0)
    async.waterfall([
        function(passFunc) {
            let strSql = "select id,vdef1 from t_piece_detaillee where vdef1 != '' limit 80,100 ;"
            sqlQuery(strSql).then((res)=>{
                passFunc(null, res);
            })
        },
        async function(pieceDetArr, passFunc) {
            pieceDetArr.forEach(async e=>{
                let pieceDetailUrl = e.vdef1;
                let pDId = e.id;
                let brouser = await puppeteer.launch(provideOptions);
                let page = await brouser.newPage();
                await page.setRequestInterception(true);
                page.on('request', interceptedRequest=>{
                    let urlObj = new URL(interceptedRequest.url())
                    if(urlObj.hostname == 'googleads.g.doubleclick.net'){
                        interceptedRequest.abort()
                    }
                    else{
                        interceptedRequest.continue();
                    }
                })

                await page.goto(pieceDetailUrl,{
                    timeout:0,
                    waitUntil: [
                        'load',                       //等待 “load” 事件触发
                        //'domcontentloaded',  //等待 “domcontentloaded” 事件触发
                        'networkidle0',          //在 500ms 内没有任何网络连接
                    ]
                })
                let clickEle = await page.$('#didomi-notice-agree-button')
                await clickEle.click()
                // let pid = pieceDet.pid;
                let produitObjArr = await page.$$eval('.title--secondary',(elem,pDId) => {
                    let objItem = [];
                    elem&&elem.forEach(e=>{
                        let curProdUrl = e.getAttribute('href')
                        if(curProdUrl){
                            let insertObj = {
                                id:Math.round(Math.random() * 100000000),
                                url:curProdUrl,
                                pdid:pDId
                            }
                            objItem.push(insertObj)
                        }
                    })
                    return objItem;
                },pDId)//注意这里传参数的时候cid两边都要写！！！！！！！

                produitObjArr.forEach(obj=>{
                    let strSql = "insert into t_produit(id, name, vdef1, pdid) values(?,'default',?,?);"
                    let arr = [obj.id,obj.url,obj.pdid]
                    sqlQuery(strSql, arr)
                    console.log('insert the piece of pd['+obj.pdid+'] is: id['+obj.id+'], product url ['+obj.url+'] avec succès')    
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

