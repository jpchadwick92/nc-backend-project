const express = require("express");
const { getCategories } = require("./Controllers/categories.controllers");
const app = express();

app.get("/api/categories", getCategories);

module.exports = app;
