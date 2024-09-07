import asyncHandler from "express-async-handler";
import SubCategoriesModel from "../Models/SubCategoriesModel";
import {
	createOne,
	deleteOne,
	getAll,
	getOne,
	updateOne,
} from "./refactorHandler";
import { SubCategories } from "../interfaces/SubCategories";
import { uploadSingleImage } from "../Middleware/uploadImages";
import sharp from "sharp";
import { FilterData } from "../interfaces/filterData";
import { NextFunction, Request, Response } from "express";

export const createSubCategory = createOne<SubCategories>(SubCategoriesModel);

export const getSubCategories = getAll<SubCategories>(
	SubCategoriesModel,
	"subcategories"
);

export const getSubCategory = getOne<SubCategories>(SubCategoriesModel);

export const updateSubCategory = updateOne<SubCategories>(SubCategoriesModel);

export const deleteSubCategory = deleteOne<SubCategories>(SubCategoriesModel);

export const uploadSubcategoryImage = uploadSingleImage("image");

export const resizeSubcategoryImage = asyncHandler(async (req, res, next) => {
	if (req.file) {
		const imageName: string = `subcategory-${Date.now()}.jpeg`;
		await sharp(req.file.buffer)
			.toFormat("jpeg")
			.jpeg({ quality: 95 })
			.toFile(`uploads/subcategories/${imageName}`);
		req.body.image = imageName;
	}
	next();
});

export const filterData = (req: Request, res: Response, next: NextFunction) => {
	let filterData: FilterData = {};
	if (req.params.categoryId) {
		filterData.category = req.params.categoryId;
	}
	req.filterData = filterData;
	next();
};

export const setCategoryId = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (!req.body.category) {
		req.body.category = req.params.categoryId;
	}
	next();
};
