const { getUsers } = require("../Controllers/users.controllers");

const usersRouter = require("express").Router();

usersRouter.route("/").get(getUsers);

module.exports = usersRouter;
