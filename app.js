const express = require("express");
const { customErrorHandler, postgresErrorHandler } = require("./errorHandler");
const app = express();
const apiRouter = require("./Routers/api-router")

app.use(express.json());

app.use("/api",apiRouter)

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Route Does Not Found" });
});
app.use(postgresErrorHandler);
app.use(customErrorHandler);

module.exports = app;
