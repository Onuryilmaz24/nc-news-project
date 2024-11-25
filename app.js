const express = require("express"); 
const endpointsJson = require("./endpoints.json");
const { coreController } = require("./Core/coreController");

const app = express();

app.get("/api",coreController)


module.exports = app