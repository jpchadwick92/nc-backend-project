const { deleteComment } = require("../Controllers/comments.controllers");

const commentsRouter = require("express").Router();

commentsRouter.delete("/:comment_id", deleteComment);

module.exports = commentsRouter;
