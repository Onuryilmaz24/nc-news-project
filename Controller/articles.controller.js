const {
  selectArticleById,
  selectAllArticles,
  updateArticleVoteById,
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
  const { author, topic, sort_by, order, votes, comment_count } = req.query;
  selectAllArticles(author, topic, sort_by, order, votes, comment_count)
    .then((articles) => {
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
