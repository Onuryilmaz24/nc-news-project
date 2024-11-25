const express = require("express"); 
const { coreController } = require("./Controller/coreController");
const { getAllTopics } = require("./Controller/topics.controller");
const { customErrorHandler, postgresErrorHandler } = require("./errorHandler");
const { getArticleById } = require("./Controller/articles.controller");

const app = express();

app.get("/api",coreController)

app.get("/api/topics",getAllTopics)

app.get("/api/articles/:article_id",getArticleById)

app.all("*",(req,res)=>{
    res.status(404).send({msg:"Route Does Not Found"})
})
app.use(postgresErrorHandler);
app.use(customErrorHandler);


module.exports = app