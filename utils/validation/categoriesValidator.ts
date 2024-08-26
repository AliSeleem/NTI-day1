import { RequestHandler } from "express";
import { check } from "express-validator";
import validatorMiddleware from "../../Middleware/validatorMiddleware";
import CategoriesModel from "../../Models/CategoriesModel";
import SubCategoriesModel from "../../Models/SubCategoriesModel";

export const getCategoryValidator: RequestHandler[] = [
	check("id").isMongoId().withMessage("Invalid mongo Id"),
	validatorMiddleware,
];

export const deleteCategoryValidator: RequestHandler[] = [
	check("id").isMongoId().withMessage("Invalid mongo Id"),
	validatorMiddleware,
];

export const createCategoryValidator: RequestHandler[] = [
	check("name")
		.notEmpty()
		.withMessage("Name is required")
		.isLength({ min: 2, max: 50 })
		.withMessage("Name length must be between 2 and 50"),
	validatorMiddleware,
];

export const updateCategoryValidator: RequestHandler[] = [
	check("id").isMongoId().withMessage("Invalid mongo Id"),
	check("name")
		.optional()
		.isLength({ min: 2, max: 50 })
		.withMessage("Name length must be between 2 and 50"),
	validatorMiddleware,
];
