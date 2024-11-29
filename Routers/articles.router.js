const { getAllArticles, getArticleById, patchArticleVoteById, postArticle, deleteArticleById } = require("../Controller/articles.controller");
const commentRouter = require("./comments.router");


const articleRouter = require("express").Router();

articleRouter.get("/",getAllArticles)
articleRouter.get("/:article_id",getArticleById)
articleRouter.patch("/:article_id",patchArticleVoteById)
articleRouter.post("/",postArticle);
articleRouter.delete("/:article_id",deleteArticleById)

articleRouter.use("/:article_id/comments",commentRouter)

module.exports = articleRouter