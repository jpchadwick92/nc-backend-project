const {
  fetchCategories,
  fetchReviewsById,
  fetchUsers,
  updateReview,
  fetchReviews,
  fetchComments,
} = require("../Models/categories.models");

exports.getCategories = (req, res, next) => {
  fetchCategories()
    .then((categories) => {
      res.status(200).send({ categories });
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
exports.getReviews = (req, res, next) => {
  const { category } = req.query;
  fetchReviews(category)
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch(next);
};
exports.getComments = (req, res, next) => {
  const { review_id } = req.params;
  fetchComments(review_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
      res.status(200).send({ users });
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
