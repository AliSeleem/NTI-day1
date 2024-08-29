import { RequestHandler } from "express";
import { check } from "express-validator";
import validatorMiddleware from "../../Middleware/validatorMiddleware";
import CategoriesModel from "../../Models/CategoriesModel";
import SubCategoriesModel from "../../Models/SubCategoriesModel";
import { SubCategories } from "../../interfaces/SubCategories";

export const getCategoryValidator: RequestHandler[] = [
	check("id").isMongoId().withMessage("Invalid mongo Id"),
	validatorMiddleware,
];

export const deleteCategoryValidator: RequestHandler[] = [
	check("id")
		.isMongoId()
		.withMessage("Invalid mongo Id")
		.custom(async (val) => {
			const subcategories: SubCategories[] = await SubCategoriesModel.find({
				category: val,
			});
			if (subcategories.length > 0) {
				const bulkOption = subcategories.map((subcategory: SubCategories) => {
					return { deleteOne: { filter: { _id: subcategory._id } } };
				});
				await SubCategoriesModel.bulkWrite(bulkOption);
			}
			return true;
		}),
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
