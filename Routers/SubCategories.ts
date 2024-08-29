import express from "express";
import {
	deleteSubCategory,
	createSubCategory,
	getSubCategories,
	getSubCategory,
	updateSubCategory,
} from "../Controllers/SubCategories";
import {
	createSubCategoryValidator,
	deleteSubCategoryValidator,
	getSubCategoryValidator,
	updateSubCategoryValidator,
} from "../utils/validation/subcategoriesValidator";
const SubCategoriesRouter = express.Router();

SubCategoriesRouter.route("/")
	.get(getSubCategories)
	.post(createSubCategoryValidator, createSubCategory);
SubCategoriesRouter.route("/:id")
	.get(getSubCategoryValidator, getSubCategory)
	.put(updateSubCategoryValidator, updateSubCategory)
	.delete(deleteSubCategoryValidator, deleteSubCategory);

export default SubCategoriesRouter;
