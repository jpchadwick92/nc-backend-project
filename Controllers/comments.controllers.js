const {
  fetchComments,
  addComment,
  removeComment,
} = require("../Models/comments.models");

exports.getComments = (req, res, next) => {
  const { review_id } = req.params;
  fetchComments(review_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const { review_id } = req.params;
  const { username, body } = req.body;
  addComment(body, username, review_id)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  removeComment(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
