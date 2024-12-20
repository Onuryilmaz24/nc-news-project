const { getAllUsers, getUserById, addUsers } = require("../Controller/users.controller");


const usersRouter = require("express").Router();

usersRouter.get("/",getAllUsers)

usersRouter.get("/:username",getUserById)

usersRouter.post("/",addUsers)

module.exports = usersRouter