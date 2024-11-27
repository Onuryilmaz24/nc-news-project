const { getAllUsers } = require("../Controller/users.controller");


const usersRouter = require("express").Router();

usersRouter.get("/",getAllUsers)

module.exports = usersRouter