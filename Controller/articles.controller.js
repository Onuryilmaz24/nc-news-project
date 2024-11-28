const {
  selectArticleById,
  selectAllArticles,
  updateArticleVoteById,
  addNewArticle,
} = require("../Models/articles.models");
const { checkExist } = require("../Models/checkExists");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAllArticles = (req, res, next) => {
  const { author, topic, sort_by, order, votes, comment_count ,limit, p } = req.query;
  const promises = [selectAllArticles(author, topic, sort_by, order, votes, comment_count, limit, p)]

  if(topic){
    promises.push(checkExist("topics","slug",topic))
  }
  Promise.all(promises)
    .then(([articles]) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleVoteById = (req, res, next) => {
  const articleId = req.params.article_id;
  const updateBody = req.body;

  const promises = [updateArticleVoteById(articleId, updateBody)];

  if (articleId) {
    promises.push(checkExist("articles", "article_id", articleId));
  }

  Promise.all(promises)
    .then(([updatedArticle]) => {
      res.status(200).send({ updatedArticle });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postArticle = (req,res,next) => {

  const postBody = req.body;

  addNewArticle(postBody).then((id)=>{
    return selectArticleById(id)
  }).then((article)=>{
    res.status(201).send({article})
  }).catch((err)=>{
    next(err)
  })


}
