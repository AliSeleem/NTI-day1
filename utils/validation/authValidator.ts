import { RequestHandler } from "express";
import { check } from "express-validator";
import validatorMiddleware from "../../Middleware/validatorMiddleware";

export const loginValidator: RequestHandler[] = [
	check("email")
		.isEmpty()
		.withMessage("Email is required")
		.isEmail()
		.withMessage("Invalid email"),
	check("password")
		.isLength({ min: 8, max: 20 })
		.withMessage("Password must be at least 8 and no more than 20 characters"),
	validatorMiddleware,
];

export const signupValidator: RequestHandler[] = [
	check("email")
		.isEmpty()
		.withMessage("Email is required")
		.isEmail()
		.withMessage("Invalid email"),
	check("password")
		.isLength({ min: 8, max: 20 })
		.withMessage("Password must be at least 8 and no more than 20 characters"),
	check("confirmPassword")
		.isLength({ min: 8, max: 20 })
		.withMessage(
			"Confirm password must be at least 8 and no more than 20 characters"
		)
		.custom((value, { req }) => value === req.body.password)
		.withMessage("Passwords do not match"),
	validatorMiddleware,
];
