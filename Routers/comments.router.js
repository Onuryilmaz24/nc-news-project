const { deleteCommentByCommentId, postCommentByArticleId, getArticleCommentsById, patchCommentById } = require("../Controller/comments.controller");


const commentRouter = require("express").Router({ mergeParams: true });

commentRouter.delete("/:comment_id",deleteCommentByCommentId)

commentRouter.post("/",postCommentByArticleId);

commentRouter.get("/",getArticleCommentsById);

commentRouter.patch("/:comment_id",patchCommentById);

module.exports = commentRouter