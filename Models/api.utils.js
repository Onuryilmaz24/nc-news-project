const format = require("pg-format")
const db = require("../db/connection");

exports.checkExist = async(table,column,value) =>{
    const queryStr = format("SELECT * FROM %I WHERE %I = $1",table,column);
    const dbOutput = await db.query(queryStr,[value]);

    if(dbOutput.rows.length === 0 ){
        return Promise.reject({status: 404, msg: "Does Not Found"})
    }
}

exports.countArticles = (topic) => {
    let queryStr = `SELECT * FROM articles`
    const queryValues = [];
    if(topic){
        queryStr += ` WHERE topic = $1`;
        queryValues.push(topic)
    }
    return db.query(queryStr,queryValues).then(({rows})=>{
        return rows.length;
    })
}