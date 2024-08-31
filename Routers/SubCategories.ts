import express from "express";
import {
	deleteSubCategory,
	createSubCategory,
	getSubCategories,
	getSubCategory,
	updateSubCategory,
	filterData,
	setCategoryId,
} from "../Controllers/SubCategories";
import {
	createSubCategoryValidator,
	deleteSubCategoryValidator,
	getSubCategoryValidator,
	updateSubCategoryValidator,
} from "../utils/validation/subcategoriesValidator";
import { allowedTo, checkActive, protectRoutes } from "../Controllers/auth";
const SubCategoriesRouter = express.Router({ mergeParams: true });

SubCategoriesRouter.route("/")
	.get(filterData, getSubCategories)
	.post(
		protectRoutes,
		checkActive,
		allowedTo("manager", "admin"),
		setCategoryId,
		createSubCategoryValidator,
		createSubCategory
	);
SubCategoriesRouter.route("/:id")
	.get(getSubCategoryValidator, getSubCategory)
	.put(
		protectRoutes,
		checkActive,
		allowedTo("manager", "admin"),
		updateSubCategoryValidator,
		updateSubCategory
	)
	.delete(
		protectRoutes,
		checkActive,
		allowedTo("manager", "admin"),
		deleteSubCategoryValidator,
		deleteSubCategory
	);

export default SubCategoriesRouter;
