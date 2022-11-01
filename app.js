const express = require("express");
const apiRouter = require("./Routes/api-router");
const app = express();
app.use(express.json());

app.use("/api", apiRouter);

app.use((err, req, res, next) => {
  const badRequestCodes = ["22P02", "23502"];
  if (badRequestCodes.includes(err.code)) {
    res.status(400).send({ msg: "bad request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("Internal server error");
});

module.exports = app;
