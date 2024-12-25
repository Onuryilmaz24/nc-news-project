const db = require("../db/connection");

exports.selectArticleById = (article_id) => {
  let sqlText = `SELECT articles.article_id,
  articles.title,
  articles.topic,
  articles.author,
  articles.body,
  articles.created_at,
  articles.votes,
  articles.article_img_url,
  CAST(COUNT(comment_id) AS INTEGER) AS comment_count
  FROM articles 
  LEFT JOIN comments ON comments.article_id = articles.article_id`;
  let values = [];

  if (article_id) {
    sqlText += ` WHERE articles.article_id = $1`;
    values.push(article_id);
  }
  sqlText += ` GROUP BY articles.author,articles.title,articles.article_id,articles.topic,articles.created_at,articles.votes,articles.article_img_url`;

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
  comment_count,
  limit = 10,
  p = 1
) => {
  const validSortBy = [
    "author",
    "title",
    "author",
    "votes",
    "created_at",
    "comment_count",
    "article_id",
  ];
  const validOrder = ["DESC", "ASC"];

  if (
    !validOrder.includes(order) ||
    !validSortBy.includes(sort_by) ||
    Number(limit) === 0
  ) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  let sqlText = `SELECT articles.author,
                    articles.title,
                    articles.article_id,
                    articles.topic,
                    articles.created_at,
                    articles.votes,
                    articles.article_img_url,
                    CAST(COUNT(comment_id) AS INTEGER) AS comment_count
                    FROM articles
                    LEFT JOIN comments ON comments.article_id = articles.article_id 
                    `;

  const values = [];
  const sqlTextValues = [];

  if (topic) {
    sqlTextValues.push(`articles.topic = $${values.length + 1}`);
    values.push(topic);
  }

  if (values.length > 0) {
    sqlText += ` WHERE ${sqlTextValues.join(" AND ")} `;
  }

  sqlText += ` GROUP BY articles.author,articles.title,articles.article_id,articles.topic,articles.created_at,articles.votes,articles.article_img_url`;

  sqlText += ` ORDER BY ${sort_by} ${order}`;

  const offset = (p - 1) * limit;
  sqlText += ` LIMIT ${limit} OFFSET ${offset}`;

  return db.query(sqlText, values).then(({ rows }) => {
    return rows;
  });
};

exports.updateArticleVoteById = (article_id, updateBody) => {
  const validUpdate = ["inc_vote"];
  if (
    !Object.keys(updateBody).every((key) => {
      return validUpdate.includes(key);
    })
  ) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  const { inc_vote } = updateBody;
  let sqlText = `UPDATE articles
  SET votes = votes + $1
  WHERE article_id = $2
  RETURNING*;`;

  return db.query(sqlText, [inc_vote, article_id]).then(({ rows }) => {
    return rows[0];
  });
};

exports.addNewArticle = (articleBody) => {
  const validColumns = ["title", "topic", "author", "body", "article_img_url"];

  if (
    !Object.keys(articleBody).every((key) => {
      return validColumns.includes(key);
    })
  ) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  const { title, topic, author, body, article_img_url } = articleBody;
  const values = [title, topic, author, body];
  if (article_img_url) {
    sqlInsertQuery = `
      INSERT INTO articles(title, topic, author, body, article_img_url)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`;
    values.push(article_img_url);
  } else {
    sqlInsertQuery = `
      INSERT INTO articles(title, topic, author, body)
      VALUES ($1, $2, $3, $4)
      RETURNING *`;
  }

  return db.query(sqlInsertQuery, values).then(({ rows }) => {
    return rows[0].article_id;
  });
};

exports.removeArticleById = (article_id) => {
  const sqlTextArticles =
    "DELETE FROM articles WHERE article_id = $1 RETURNING*";
  const values = [article_id];

  const articleQuery = db.query(sqlTextArticles, values);

  return articleQuery.then(({ rows }) => {
    return rows[0];
  });
};
