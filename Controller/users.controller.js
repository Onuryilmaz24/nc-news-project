const { checkExist } = require("../Models/api.utils");
const {
  selectAllUsers,
  selectUserByUsername,
  addNewUser,
} = require("../Models/users.models");

exports.getAllUsers = (req, res, next) => {
  selectAllUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUserById = (req, res, next) => {
  const username = req.params.username;

  const promises = [selectUserByUsername(username)];

  if (username) {
    promises.push(checkExist("users", "username", username));
  }
  Promise.all(promises)
    .then(([user]) => {
      res.status(200).send({ user });
    })
    .catch((err) => {
      next(err);
    });
};

exports.addUsers = (req, res, next) => {
  const postBody = req.body;
  addNewUser(postBody)
    .then((user) => {
      res.status(201).send({ user });
    })
    .catch((err) => {
      next(err);
    });
};
