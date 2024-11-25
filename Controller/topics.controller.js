const { selectAllTopics } = require("../Models/topics.models")

exports.getAllTopics = (req,res,next) =>{
     selectAllTopics().then((topics)=>{
        res.status(200).send({topics})
     }).catch((err)=>{
        console.log(err);
        next(err)
     })
}