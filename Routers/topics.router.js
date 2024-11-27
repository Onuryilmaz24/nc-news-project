const { getAllTopics } = require("../Controller/topics.controller");

const topicsRouter = require("express").Router();

topicsRouter.get("/", getAllTopics)

module.exports = topicsRouter

