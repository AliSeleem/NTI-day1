import { RequestHandler } from "express";
import { check } from "express-validator";
import validatorMiddleware from "../../Middleware/validatorMiddleware";

export const getSubCategoryValidator: RequestHandler[] = [
	check("id").isMongoId().withMessage("Invalid mongo Id"),
	validatorMiddleware,
];

export const deleteSubCategoryValidator: RequestHandler[] = [
	check("id").isMongoId().withMessage("Invalid mongo Id"),
	validatorMiddleware,
];

export const createSubCategoryValidator: RequestHandler[] = [
	check("name")
		.notEmpty()
		.withMessage("Name is required")
		.isLength({ min: 2, max: 50 })
		.withMessage("Name length must be between 2 and 50"),
	check("category")
		.notEmpty()
		.withMessage("Category is required")
		.isMongoId()
		.withMessage("Invalid Mongo Id"),
	validatorMiddleware,
];

export const updateSubCategoryValidator: RequestHandler[] = [
	check("id").isMongoId().withMessage("Invalid mongo Id"),
	check("name")
		.optional()
		.isLength({ min: 2, max: 50 })
		.withMessage("Name length must be between 2 and 50"),
	check("category").optional().isMongoId().withMessage("Invalid Mongo Id"),
	validatorMiddleware,
];
