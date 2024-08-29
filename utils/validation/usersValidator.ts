import { RequestHandler } from "express";
import { check } from "express-validator";
import validatorMiddleware from "../../Middleware/validatorMiddleware";
import usersModel from "../../Models/usersModel";

export const createUserValidator: RequestHandler[] = [
	check("name")
		.notEmpty()
		.withMessage("User Name is Required")
		.isLength({ min: 2, max: 50 })
		.withMessage("Name length must be between 2 and 50"),
	check("email")
		.notEmpty()
		.withMessage("Email is Required")
		.isEmail()
		.withMessage("Invalid Email")
		.custom(async (val: string) => {
			const user = await usersModel.findOne({ email: val });
			if (user) {
				throw new Error(`email is already exist`);
			}
			return true;
		}),
	check("password")
		.notEmpty()
		.withMessage("password required")
		.isLength({ min: 8, max: 20 })
		.withMessage("password length must between 8 and 20 char")
		.custom((val: string, { req }) => {
			if (val !== req.body.confirmPassword) {
				throw new Error("passwords doesn't match");
			}
			return true;
		}),
	check("confirmPassword")
		.notEmpty()
		.withMessage("confirm password required")
		.isLength({ min: 8, max: 20 })
		.withMessage("confirm password length must between 8 and 20 char"),
	validatorMiddleware,
];

export const updateUserValidator: RequestHandler[] = [
	check("name")
		.optional()
		.isLength({ min: 2, max: 50 })
		.withMessage("Name length must be between 2 and 50"),
	check("active").optional().isBoolean().withMessage("Invalid Active value"),
	validatorMiddleware,
];

export const getUserValidator: RequestHandler[] = [
	check("id").isMongoId().withMessage("Invalid Mongo Id"),
	validatorMiddleware,
];

export const deleteUserValidator: RequestHandler[] = [
	check("id").isMongoId().withMessage("Invalid Mongo Id"),
	validatorMiddleware,
];

// todo: user change password validator
export const changeUserPasswordValidator: RequestHandler[] = [
	check("id").isMongoId().withMessage("Invalid Mongo Id"),
	check("password")
		.notEmpty()
		.isLength({ min: 8, max: 20 })
		.withMessage("password length must between 8 and 20 char"),
	check("confirmPassword")
		.notEmpty()
		.isLength({ min: 8, max: 20 })
		.withMessage("confirm password length must between 8 and 20 char")
		.custom((val: string, { req }) => {
			if (val !== req.body.password) {
				throw new Error("passwords doesn't match");
			}
			return true;
		}),
	validatorMiddleware,
];
