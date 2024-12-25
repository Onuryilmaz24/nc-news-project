const { getAllUsers, getUserById, addUsers, deleteUsers } = require("../Controller/users.controller");


const usersRouter = require("express").Router();

usersRouter.get("/",getAllUsers)

usersRouter.get("/:username",getUserById)

usersRouter.post("/",addUsers)

usersRouter.delete("/:username",deleteUsers)

module.exports = usersRouter