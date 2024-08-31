import { RequestHandler } from "express";
import { check } from "express-validator";
import validatorMiddleware from "../../Middleware/validatorMiddleware";
import usersModel from "../../Models/usersModel";

export const loginValidator: RequestHandler[] = [
	check("email")
		.notEmpty()
		.withMessage("Email is required")
		.isEmail()
		.withMessage("Invalid email"),
	check("password")
		.notEmpty()
		.withMessage("Password is required")
		.isLength({ min: 8, max: 20 })
		.withMessage("Password must be at least 8 and no more than 20 characters"),
	validatorMiddleware,
];

export const signupValidator: RequestHandler[] = [
	check("name")
		.notEmpty()
		.withMessage("Name is required")
		.isLength({ min: 2, max: 50 })
		.withMessage("Name must be at least 2 and no more than 50 characters"),
	check("email")
		.notEmpty()
		.withMessage("Email is required")
		.isEmail()
		.withMessage("Invalid email")
		.custom(async (val: string) => {
			const user = await usersModel.findOne({ email: val });
			if (user) {
				throw new Error(`email is already exist`);
			}
			return true;
		}),
	check("password")
		.isLength({ min: 8, max: 20 })
		.withMessage("Password must be at least 8 and no more than 20 characters")
		.custom((val: string, { req }) => {
			if (val !== req.body.confirmPassword) {
				throw new Error("passwords doesn't match");
			}
			return true;
		}),
	check("confirmPassword")
		.isLength({ min: 8, max: 20 })
		.withMessage(
			"Confirm password must be at least 8 and no more than 20 characters"
		)
		.custom((value, { req }) => value === req.body.password)
		.withMessage("Passwords do not match"),
	validatorMiddleware,
];

export const sendMailValidator: RequestHandler[] = [
	check("email")
		.notEmpty()
		.withMessage("Email is required")
		.isEmail()
		.withMessage("Invalid email"),
	validatorMiddleware,
];

export const resetCodeValidator: RequestHandler[] = [
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
];
