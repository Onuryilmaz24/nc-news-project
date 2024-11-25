const express = require("express"); 
const { coreController } = require("./Controller/coreController");
const { getAllTopics } = require("./Controller/topics.controller");
const { customErrorHandler } = require("./errorHandler");

const app = express();

app.get("/api",coreController)

app.get("/api/topics",getAllTopics)

app.all("*",(req,res)=>{
    res.status(404).send({msg:"Route Does Not Found"})
})

app.use(customErrorHandler)

module.exports = app