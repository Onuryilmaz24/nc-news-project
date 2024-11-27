const db = require("../db/connection");

exports.selectAllUsers = () => {
  let sqlText = `SELECT * FROM users`;

  return db.query(sqlText).then(({ rows }) => {
    return rows;
  });
};
