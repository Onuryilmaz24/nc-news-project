const db = require("../db/connection");

exports.selectArticleById = (article_id) => {
  let sqlText = `SELECT title,
  topic,
  articles.author,
  articles.body,
  articles.created_at,
  articles.votes,
  COUNT(comment_id) AS comment_count
  FROM articles 
  JOIN comments ON comments.article_id = articles.article_id `;
  let values = [];
  let sqlTextValues = [];

  if (article_id) {
    sqlTextValues.push(`articles.article_id = $${values.length + 1}`);
    values.push(article_id);
  }

  if (values.length > 0) {
    sqlText += ` WHERE ${sqlTextValues.join(' AND ')} `;
  }

  sqlText += 'GROUP BY articles.article_id, title, topic, articles.author, articles.body, articles.created_at, articles.votes';
  return db.query(sqlText,values).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 400, msg: "Bad Request" });
    }
    return rows[0]
  });
};
