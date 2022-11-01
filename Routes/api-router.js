const { getEndpoints } = require("../Controllers/api.controllers");
const categoriesRouter = require("./categories-router");
const commentsRouter = require("./comments-router");
const reviewsRouter = require("./reviews-router");
const usersRouter = require("./users-router");

const apiRouter = require("express").Router();

apiRouter.get("/", getEndpoints);

apiRouter.use("/reviews", reviewsRouter);

apiRouter.use("/comments", commentsRouter);

apiRouter.use("/categories", categoriesRouter);

apiRouter.use("/users", usersRouter);

module.exports = apiRouter;
