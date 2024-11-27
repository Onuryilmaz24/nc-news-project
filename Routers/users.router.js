const { getAllUsers, getUserById } = require("../Controller/users.controller");


const usersRouter = require("express").Router();

usersRouter.get("/",getAllUsers)

usersRouter.get("/:username",getUserById)

module.exports = usersRouter