const {
  deleteComment,
  patchCommentById,
} = require("../Controllers/comments.controllers");

const commentsRouter = require("express").Router();

commentsRouter
  .route("/:comment_id")
  .delete(deleteComment)
  .patch(patchCommentById);

module.exports = commentsRouter;
