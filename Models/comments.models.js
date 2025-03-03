const db = require("../db/connection");

exports.selectAllCommentsById = (
  article_id,
  sort_by = "created_at",
  order = "DESC",
  limit=10,
  p=1
) => {
  let sqlText = `SELECT * FROM comments`;
  let values = [];
  const validOrder = ["DESC", "ASC"];
  const validSortBy = ["created_at","comment_id"];
  if (!validOrder.includes(order) || !validSortBy.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  if (article_id) {
    sqlText += " WHERE article_id = $1";
    values.push(article_id);
  }

  sqlText += ` ORDER BY ${sort_by} ${order}`;

  const offset = (p - 1) * limit;

  sqlText += ` LIMIT ${limit} OFFSET ${offset}`
  


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

exports.removeCommentById = (comment_id) => {
  let sqlText = "DELETE FROM comments WHERE comment_id = $1 RETURNING *";
  let values = [comment_id];

  return db.query(sqlText, values).then(({ rows }) => {
    return rows[0];
  });
};

exports.updateCommentVoteById = (comment_id, updateBody) => {
  const validUpdate = ["inc_vote"];
  if (!Object.keys(updateBody).every((key) => validUpdate.includes(key))) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  const { inc_vote } = updateBody;

  let sqlText = `UPDATE comments
  SET votes = votes + $1
  WHERE comment_id = $2
  RETURNING*;`;

  return db.query(sqlText, [inc_vote, comment_id]).then(({ rows }) => {
    return rows[0];
  });
};
