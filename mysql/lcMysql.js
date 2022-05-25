let mysql = require('mysql')

let options = {
    host:'localhost',
    port:'3306',
    user:'root',
    password:'0423',
    database:'mo_automobile'
}

let con = mysql.createConnection(options)

con.connect((err)=>{
    if(err){
        console.log(err)
    }else{
        console.log("connnect with success")
    }
})

function sqlQuery(strSql, arr){
    return new Promise((resolve, reject)=>{
        con.query(strSql, arr, (err, results)=>{
            if(err){
                reject(err)
            }else{
                resolve(results)
            }
        })
     }).catch(e=>console.log(e))
}

module.exports = sqlQuery