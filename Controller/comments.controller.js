const { checkExist } = require("../Models/checkExists");
const {
  selectAllCommentsById,
  addCommentByArticleId,
} = require("../Models/comments.models");

exports.getArticleCommentsById = (req, res, next) => {
  const articleId  = req.params.article_id;
  const { sort_by, order } = req.query;

  const promises = [selectAllCommentsById(articleId, sort_by, order)]

  if(articleId){
    promises.push(checkExist("articles","article_id",articleId))
  }
  Promise.all(promises)
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
        console.log(err)
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
      console.log(err);
      next(err);
    });
};
