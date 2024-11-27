const { deleteCommentByCommentId, postCommentByArticleId, getArticleCommentsById } = require("../Controller/comments.controller");


const commentRouter = require("express").Router({ mergeParams: true });

commentRouter.delete("/:comment_id",deleteCommentByCommentId)

commentRouter.post("/",postCommentByArticleId);

commentRouter.get("/",getArticleCommentsById);

module.exports = commentRouter