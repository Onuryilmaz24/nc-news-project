const {
  selectArticleById,
  selectAllArticles,
  updateArticleVoteById,
  addNewArticle,
} = require("../Models/articles.models");
const { checkExist, countArticles } = require("../Models/api.utils");

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
  const promises = [selectAllArticles(author, topic, sort_by, order, votes, comment_count, limit, p),countArticles(topic)]

  if(topic){
    promises.push(checkExist("topics","slug",topic))
  }
  Promise.all(promises)
    .then(([articles,total_count]) => {
      res.status(200).send({articles, total_count});
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
