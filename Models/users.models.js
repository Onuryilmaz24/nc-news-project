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