const db = require("../db/connection");

exports.selectAllUsers = () => {
  let sqlText = `SELECT * FROM users`;

  return db.query(sqlText).then(({ rows }) => {
    return rows;
  });
};

exports.selectUserByUsername = (username) => {
  const sqlText = `SELECT * FROM users WHERE username = $1`

  const values = [username]


  return db.query(sqlText,values).then(({rows})=>{
    return rows[0]
  })
}

exports.addNewUser = (postBody) => {

  const validColumns = ["username","name","avatar_url"]

  if(!Object.keys(postBody).every((key)=>validColumns.includes(key))){
    return Promise.reject({status:400,msg:"Bad Request"})
  }

  const {username,name,avatar_url} = postBody
  const values = [username,name]

  if(username.trim().length === 0 || name.trim().length === 0 ){
    return Promise.reject({status:400,msg:"Bad Request"})
  }
  let sqlInsertQuery =``
  if(avatar_url){
    sqlInsertQuery = `INSERT INTO users(username,name,avatar_url)
    VALUES ($1,$2,$3)
    RETURNING*`
    values.push(avatar_url)
  } else{
    sqlInsertQuery = `INSERT INTO users(username,name)
    VALUES ($1,$2)
    RETURNING*`
    
  }
  

  return db.query(sqlInsertQuery,values).then(({rows})=>{
    return rows[0]
})

}