const { selectArticleById, selectAllArticles } = require("../Models/articles.models")

exports.getArticleById = (req,res,next) => {
    const {article_id} = req.params

    selectArticleById(article_id).then((article)=>{
        res.status(200).send({article})
    }).catch((err)=>{
        next(err)
    })
}

exports.getAllArticles = (req,res,next) =>{
    const {author,topic,sort_by,order,votes,comment_count} = req.query
    selectAllArticles(author,topic,sort_by,order,votes,comment_count).then((articles)=>{
        res.status(200).send({articles})
    }).catch((err)=>{
        next(err)
    })

}