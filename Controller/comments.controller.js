const { checkExist } = require("../Models/api.utils");
const {
  selectAllCommentsById,
  addCommentByArticleId,
  removeCommentById,
  updateCommentVoteById,
} = require("../Models/comments.models");

exports.getArticleCommentsById = (req, res, next) => {
  const articleId = req.params.article_id;
  const { sort_by, order,limit,p} = req.query;

  const promises = [selectAllCommentsById(articleId, sort_by, order,limit,p)];

  if (articleId) {
    promises.push(checkExist("articles", "article_id", articleId));
  }
  Promise.all(promises)
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentByArticleId = (req, res, next) => {
  const postBody = req.body;
  const { article_id } = req.params;
  addCommentByArticleId(article_id, postBody)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteCommentByCommentId = (req, res, next) => {
  const commentId = req.params.comment_id;

  const promises = [removeCommentById(commentId)];

  if (commentId) {
    promises.push(checkExist("comments", "comment_id", commentId));
  }

  Promise.all(promises)
    .then(([comment]) => {
      res.status(204).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchCommentById = (req,res,next) => {
  const commentId = req.params.comment_id;
  const updateBody = req.body;

  const promises = [updateCommentVoteById(commentId,updateBody)];

  promises.push(checkExist("comments","comment_id",commentId))

  Promise.all(promises).then(([comment])=>{
    res.status(200).send({comment})
  }).catch((err)=>{
   next(err)
  })

}
