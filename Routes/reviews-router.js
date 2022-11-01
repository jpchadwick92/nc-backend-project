const {
  getComments,
  postComment,
} = require("../Controllers/comments.controllers");
const {
  getReviews,
  getReviewsById,
  patchReviewById,
} = require("../Controllers/reviews.controllers");

const reviewsRouter = require("express").Router();

reviewsRouter.route("/").get(getReviews);

reviewsRouter.route("/:review_id").get(getReviewsById).patch(patchReviewById);

reviewsRouter.route("/:review_id/comments").get(getComments).post(postComment);

module.exports = reviewsRouter;
