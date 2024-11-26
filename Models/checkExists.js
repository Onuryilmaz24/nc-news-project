const format = require("pg-format")
const db = require("../db/connection");

exports.checkExist = async(table,column,value) =>{
    const queryStr = format("SELECT * FROM %I WHERE %I = $1",table,column);
    const dbOutput = await db.query(queryStr,[value]);

    if(dbOutput.rows.length === 0 ){
        return Promise.reject({status: 404, msg: "Resource not found"})
    }
}