import express from "express";
import {
	deleteUser,
	createUser,
	getUsers,
	getUser,
	uploadUserImage,
	resizeUserImage,
	updateUser,
	changeUserPassword,
} from "../Controllers/Users";
import {
	createUserValidator,
	deleteUserValidator,
	getUserValidator,
	updateUserValidator,
} from "../utils/validation/usersValidator";
import { allowedTo, checkActive, protectRoutes } from "../Controllers/auth";
const usersRouter = express.Router();

// authrization middleware
usersRouter.use(protectRoutes, checkActive, allowedTo("manager"));

// CRUD operations
usersRouter
	.route("/")
	.get(getUsers)
	.post(uploadUserImage, resizeUserImage, createUserValidator, createUser);

usersRouter
	.route("/:id")
	.get(getUserValidator, getUser)
	.put(uploadUserImage, resizeUserImage, updateUserValidator, updateUser)
	.delete(deleteUserValidator, deleteUser);

usersRouter.put("/:id/changePassword", changeUserPassword);

export default usersRouter;
