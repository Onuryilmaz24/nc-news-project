const db = require("../db/connection");

exports.selectAllCommentsById = (
    article_id,
    sort_by = "created_at",
    order = "DESC"
  ) => {
      let sqlText = `SELECT * FROM comments`
      let values = [];
      const validOrder = ["DESC","ASC"]
      const validSortBy = ["created_at"]
      if (!validOrder.includes(order) || !validSortBy.includes(sort_by)) {
        return Promise.reject({ status: 400, msg: "Bad Request" });
      }
  
      if(article_id){
          sqlText += " WHERE article_id = $1"
          values.push(article_id)
      }
      
      sqlText += ` ORDER BY ${sort_by} ${order}`
  
      return db.query(sqlText,values).then(({rows})=>{
          if(rows.length === 0){
              return Promise.reject({status:404,msg:"Article Does Not Have Comment Yet"})
          }
  
          return rows
      })
  }
  