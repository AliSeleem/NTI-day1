import express from "express";
import {
	deleteCategory,
	createCategory,
	getCategories,
	getCategory,
	updateCategory,
	uploadCategoryImage,
	resizeCategoryImage,
} from "../Controllers/Categories";
import {
	createCategoryValidator,
	deleteCategoryValidator,
	getCategoryValidator,
	updateCategoryValidator,
} from "../utils/validation/categoriesValidator";
import SubCategoriesRouter from "./SubCategories";
import { allowedTo, checkActive, protectRoutes } from "../Controllers/auth";
const CategoriesRouter = express.Router();

CategoriesRouter.use("/:categoryId/subcategories", SubCategoriesRouter);

CategoriesRouter.route("/")
	.get(getCategories)
	.post(
		protectRoutes,
		checkActive,
		allowedTo("manager", "admin"),
		uploadCategoryImage,
		resizeCategoryImage,
		createCategoryValidator,
		createCategory
	);

CategoriesRouter.route("/:id")
	.get(getCategoryValidator, getCategory)
	.put(
		protectRoutes,
		checkActive,
		allowedTo("manager", "admin"),
		uploadCategoryImage,
		resizeCategoryImage,
		updateCategoryValidator,
		updateCategory
	)
	.delete(
		protectRoutes,
		checkActive,
		allowedTo("manager", "admin"),
		deleteCategoryValidator,
		deleteCategory
	);

export default CategoriesRouter;
