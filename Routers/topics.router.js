const { getAllTopics, postTopic } = require("../Controller/topics.controller");

const topicsRouter = require("express").Router();

topicsRouter.get("/", getAllTopics)
topicsRouter.post("/",postTopic)

module.exports = topicsRouter

