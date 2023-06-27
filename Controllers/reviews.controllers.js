const {
  fetchReviewsById,
  fetchReviews,
  updateReview,
  addReview,
} = require("../Models/reviews.models");

exports.getReviews = (req, res, next) => {
  const { category, sort_by, order, limit, p } = req.query;
  fetchReviews(category, sort_by, order, limit, p)
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch(next);
};

exports.getReviewsById = (req, res, next) => {
  const { review_id } = req.params;
  fetchReviewsById(review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};

exports.patchReviewById = (req, res, next) => {
  const { review_id } = req.params;
  const { inc_votes } = req.body;
  updateReview(inc_votes, review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};

exports.postReview = (req, res, next) => {
  const { review_body, owner, title, category, designer } = req.body;
  addReview(review_body, owner, title, category, designer)
    .then((review) => {
      res.status(201).send({ review });
    })
    .catch(next);
};
