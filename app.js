const express = require("express");
const {
  getCategories,
  getReviewsById,
  getUsers,
  patchReviewById,
  getReviews,
  getComments,
} = require("./Controllers/categories.controllers");
const app = express();
app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReviewsById);
app.get("/api/reviews", getReviews);
app.get("/api/users", getUsers);
app.get("/api/reviews/:review_id/comments", getComments);

app.patch("/api/reviews/:review_id", patchReviewById);

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
