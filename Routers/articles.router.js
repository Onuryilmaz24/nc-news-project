const { getAllArticles, getArticleById, patchArticleVoteById } = require("../Controller/articles.controller");
const commentRouter = require("./comments.router");


const articleRouter = require("express").Router();

articleRouter.get("/",getAllArticles)
articleRouter.get("/:article_id",getArticleById)
articleRouter.patch("/:article_id",patchArticleVoteById)

articleRouter.use("/:article_id/comments",commentRouter)

module.exports = articleRouter