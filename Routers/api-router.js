const { coreController } = require("../Controller/coreController");
const articleRouter = require("./articles.router");
const commentRouter = require("./comments.router");
const topicsRouter = require("./topics.router");
const usersRouter = require("./users.router");


const apiRouter = require("express").Router();

apiRouter.use("/topics",topicsRouter)

apiRouter.use("/articles",articleRouter)

apiRouter.use("/users",usersRouter)

apiRouter.use("/comments",commentRouter)

apiRouter.get("/",coreController)


module.exports = apiRouter