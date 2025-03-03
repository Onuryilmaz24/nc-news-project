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


exports.addNewTopic = (postBody)=> {
    
    const validColumns = ["slug","description"]
    if(!Object.keys(postBody).every((key)=>validColumns.includes(key))){
        return Promise.reject({status:400,msg:"Bad Request"})
    }
    
    const {slug,description} = postBody
    const values = [slug,description]


    const sqlInsertQuery = `INSERT INTO topics(slug, description)
    VALUES($1, $2)
    RETURNING*`

    return db.query(sqlInsertQuery,values).then(({rows})=>{
        return rows[0]
    })
}