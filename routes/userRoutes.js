const userRouter = require("express").Router();
const { getUsers, getUserById, createUser } = require("../controllers/user");

userRouter.get("/", getUsers);
userRouter.get("/:userId", getUserById);
userRouter.post("/", createUser);

module.exports = userRouter;
