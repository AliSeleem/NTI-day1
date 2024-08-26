import express from "express";
import {
	deleteCategory,
	createCategory,
	getCategories,
	getCategory,
	updateCategory,
} from "../Controllers/Categories";
import {
	createCategoryValidator,
	deleteCategoryValidator,
	getCategoryValidator,
	updateCategoryValidator,
} from "../utils/validation/categoriesValidator";
const CategoriesRouter = express.Router();

CategoriesRouter.route("/")
	.get(getCategories)
	.post(createCategoryValidator, createCategory);
CategoriesRouter.route("/:id")
	.get(getCategoryValidator, getCategory)
	.put(updateCategoryValidator, updateCategory)
	.delete(deleteCategoryValidator, deleteCategory);

export default CategoriesRouter;
