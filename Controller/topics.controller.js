const { selectAllTopics, addNewTopic } = require("../Models/topics.models");

exports.getAllTopics = (req, res, next) => {
  selectAllTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

exports.postTopic = (req,res,next) => {

  const postBody = req.body

  addNewTopic(postBody).then((topic)=>{
    res.status(201).send({topic})
  }).catch((err)=>{
    next(err)
  })

}
