const { selectAllCommentsById } = require("../Models/comments.models")

exports.getArticleCommentsById = (req,res,next) => {
    const {article_id} = req.params
    const{sort_by,order} = req.query
    selectAllCommentsById(article_id,sort_by,order).then((comments)=>{
        res.status(200).send({comments})
    }).catch((err)=>{
        next(err)
    })

}