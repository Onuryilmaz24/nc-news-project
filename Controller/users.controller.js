const { selectAllUsers } = require("../Models/users.models");

exports.getAllUsers = (req, res, next) => {
  selectAllUsers().then((users) => {
    res.status(200).send({ users });
  }).catch((err)=>{
    console.log(err)
    next(err)
  })
};
