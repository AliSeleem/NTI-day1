import { NextFunction, Request, Response } from "express";
import CategoriesModel from "../Models/CategoriesModel";
import ApiError from "../utils/ApiError";
import SubCategoriesModel from "../Models/SubCategoriesModel";

export const createCategory = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const Category = await CategoriesModel.create(req.body);
	res.status(201).json({ data: Category });
};

export const getCategories = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const Categories = await CategoriesModel.find();
	res.status(200).json({ data: Categories });
};

export const getCategory = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const Category = await CategoriesModel.findById(req.params.id);
	if (!Category) {
		return next(new ApiError("Category not found", 404));
	}
	res.status(200).json({ data: Category });
};

export const updateCategory = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const Category = await CategoriesModel.findByIdAndUpdate(
		req.params.id,
		req.body,
		{ new: true }
	);
	if (!Category) {
		return next(new ApiError("Category not found", 404));
	}
	res.status(201).json({ data: Category });
};

export const deleteCategory = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const Category = await CategoriesModel.findByIdAndDelete(req.params.id);
	if (!Category) {
		return next(new ApiError("Category not found", 404));
	}

	/* 
			! هبدايه مني لحد ما الباشمهندس يقول الصح
	*/
	SubCategoriesModel.find({ category: Category }).then((SubCategories) => {
		SubCategories.map(
			async (SubCategory) =>
				await SubCategoriesModel.findByIdAndDelete(SubCategory._id)
		);
	});
	res.status(204).json({});
};
