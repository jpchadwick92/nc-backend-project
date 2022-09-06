const express = require("express");
const { getCategories } = require("./Controllers/categories.controllers");
const app = express();

app.get("/api/categories", getCategories);

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("Internal server error");
});

module.exports = app;
