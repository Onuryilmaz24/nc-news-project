const db = require("../db/connection");

exports.selectAllCommentsById = (
  article_id,
  sort_by = "created_at",
  order = "DESC"
) => {
  let sqlText = `SELECT * FROM comments`;
  let values = [];
  const validOrder = ["DESC", "ASC"];
  const validSortBy = ["created_at"];
  if (!validOrder.includes(order) || !validSortBy.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  if (article_id) {
    sqlText += " WHERE article_id = $1";
    values.push(article_id);
  }

  sqlText += ` ORDER BY ${sort_by} ${order}`;

  return db.query(sqlText, values).then(({ rows }) => {
    return rows;
  });
};

exports.addCommentByArticleId = (article_id, postBody) => {
  const validColumns = ["username", "body"];

  if (!Object.keys(postBody).every((key) => validColumns.includes(key))) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  const { username, body } = postBody;
  const values = [article_id, username, body];

  let sqlInsertQuery = `INSERT INTO comments(article_id,author,body) VALUES($1,$2,$3) RETURNING *;`;

  return db.query(sqlInsertQuery, values).then(({ rows }) => {
    return rows[0];
  });
};
