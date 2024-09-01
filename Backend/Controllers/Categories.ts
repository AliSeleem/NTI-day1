import asyncHandler from "express-async-handler";
import CategoriesModel from "../Models/CategoriesModel";
import {
	createOne,
	deleteOne,
	getAll,
	getOne,
	updateOne,
} from "./refactorHandler";
import { Categories } from "../interfaces/Categories";
import { uploadSingleImage } from "../Middleware/uploadImages";
import sharp from "sharp";

export const createCategory = createOne<Categories>(CategoriesModel);

export const getCategories = getAll<Categories>(CategoriesModel, "categories");

export const getCategory = getOne<Categories>(CategoriesModel);

export const updateCategory = updateOne<Categories>(CategoriesModel);

export const deleteCategory = deleteOne<Categories>(CategoriesModel);

export const uploadCategoryImage = uploadSingleImage("image");

export const resizeCategoryImage = asyncHandler(async (req, res, next) => {
	if (req.file) {
		const imageName: string = `category-${Date.now()}.jpeg`;
		await sharp(req.file.buffer)
			.toFormat("jpeg")
			.jpeg({ quality: 95 })
			.toFile(`uploads/categories/${imageName}`);
		req.body.image = imageName;
	}
	next();
});
