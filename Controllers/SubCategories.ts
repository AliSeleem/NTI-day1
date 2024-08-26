import { NextFunction, Request, Response } from "express";
import SubCategoriesModel from "../Models/SubCategoriesModel";
import ApiError from "../utils/ApiError";

export const createSubCategory = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const SubCategory = await SubCategoriesModel.create(req.body);
	res.status(201).json({ data: SubCategory });
};

export const getSubCategories = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const SubCategories = await SubCategoriesModel.find();
	res.status(200).json({ data: SubCategories });
};

export const getSubCategory = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const SubCategory = await SubCategoriesModel.findById(req.params.id);
	if (!SubCategory) {
		return next(new ApiError("SubCategory not found", 404));
	}
	res.status(200).json({ data: SubCategory });
};

export const updateSubCategory = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const SubCategory = await SubCategoriesModel.findByIdAndUpdate(
		req.params.id,
		req.body,
		{ new: true }
	);
	if (!SubCategory) {
		return next(new ApiError("SubCategory not found", 404));
	}
	res.status(201).json({ data: SubCategory });
};

export const deleteSubCategory = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const SubCategory = await SubCategoriesModel.findByIdAndDelete(req.params.id);
	if (!SubCategory) {
		return next(new ApiError("SubCategory not found", 404));
	}
	res.status(204).json({});
};
