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
	setLoggedUserId,
	changeLoggedUserPassword,
	updateLoggedUser,
} from "../Controllers/Users";
import {
	createUserValidator,
	deleteUserValidator,
	getUserValidator,
	updateUserValidator,
	changeUserPasswordValidator,
	updateLoggedUserValidator,
	changeLoggedUserPasswordValidator,
} from "../utils/validation/usersValidator";
import { allowedTo, checkActive, protectRoutes } from "../Controllers/auth";
const usersRouter = express.Router();

// authrization middleware
usersRouter.use(protectRoutes, checkActive);

// user operations
usersRouter.get("/me", setLoggedUserId, getUser);

usersRouter.put(
	"/updateMe",
	uploadUserImage,
	resizeUserImage,
	updateLoggedUserValidator,
	updateLoggedUser
);

usersRouter.put(
	"/changeMyPassword",
	changeLoggedUserPasswordValidator,
	changeLoggedUserPassword
);

usersRouter.delete("/deleteMe", allowedTo("user"), setLoggedUserId, deleteUser);

// manager operations
usersRouter.use(allowedTo("manager"));
usersRouter
	.route("/")
	.get(getUsers)
	.post(uploadUserImage, resizeUserImage, createUserValidator, createUser);

usersRouter
	.route("/:id")
	.get(getUserValidator, getUser)
	.put(uploadUserImage, resizeUserImage, updateUserValidator, updateUser)
	.delete(deleteUserValidator, deleteUser);

usersRouter.put(
	"/:id/changePassword",
	changeUserPasswordValidator,
	changeUserPassword
);

export default usersRouter;
