const db = require("../db/connection")
exports.selectAllTopics = () =>{
    let sqlText = `SELECT * FROM topics`

    return db.query(sqlText).then(({rows})=>{
        if(rows.length === 0){
            return Promise.reject({status:400, msg:"Bad request"})
        }
        return rows
    })
}