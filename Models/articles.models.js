const db = require("../db/connection");

exports.selectArticleById = (article_id) => {
  let sqlText = `SELECT article_id,
  title,
  topic,
  author,
  body,
  created_at,
  votes,
  article_img_url
  FROM articles `;
  let values = [];

  if (article_id) {
    sqlText += `WHERE articles.article_id = $1`;
    values.push(article_id);
  }

  return db.query(sqlText, values).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Not Found" });
    }
    return rows[0];
  });
};

exports.selectAllArticles = (
  author,
  topic,
  sort_by = "created_at",
  order = "DESC",
  votes,
  comment_count
) => {
  const validSortBy = [
    "author",
    "title",
    "topic",
    "author",
    "votes",
    "created_at",
    "comment_count",
  ];
  const validOrder = ["DESC", "ASC"];

  if (!validOrder.includes(order) || !validSortBy.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  let sqlText = `SELECT articles.author,
                    articles.title,
                    articles.article_id,
                    articles.topic,
                    articles.created_at,
                    articles.votes,
                    articles.article_img_url,
                    COUNT(comment_id) AS comment_count
                    FROM articles
                    JOIN comments ON comments.article_id = articles.article_id
                    `;

  sqlText += ` GROUP BY articles.author,articles.title,articles.article_id,articles.topic,articles.created_at,articles.votes,articles.article_img_url`;

  sqlText += ` ORDER BY ${sort_by} ${order}`;

  return db.query(sqlText).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 400, msg: "Bad Request" });
    }
    return rows;
  });
};

