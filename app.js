const express = require("express");
const { coreController } = require("./Controller/coreController");
const { getAllTopics } = require("./Controller/topics.controller");
const { customErrorHandler, postgresErrorHandler } = require("./errorHandler");
const {
  getArticleById,
  getAllArticles,
  patchArticleVoteById,
} = require("./Controller/articles.controller");
const {
  getArticleCommentsById,
  postCommentByArticleId,
  deleteCommentByCommentId,
} = require("./Controller/comments.controller");

const app = express();

app.use(express.json());

app.get("/api", coreController);

app.get("/api/topics", getAllTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id/comments", getArticleCommentsById);

app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.patch("/api/articles/:article_id", patchArticleVoteById);

app.delete("/api/comments/:comment_id", deleteCommentByCommentId);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Route Does Not Found" });
});
app.use(postgresErrorHandler);
app.use(customErrorHandler);

module.exports = app;
