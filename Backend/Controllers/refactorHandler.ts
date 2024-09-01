import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import { FilterData } from "../interfaces/filterData";
import features from "../utils/features";
import ApiError from "../utils/ApiError";

export const getAll = <modelType>(
	model: mongoose.Model<any>,
	modelName: string
) =>
	asyncHandler(
		async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			let filterData: FilterData = {};
			if (req.filterData) {
				filterData = req.filterData;
			}

			// Feature instantiation
			const apiFeatures: features = new features(
				model.find(filterData),
				req.query
			);
			// appling all methods but pagination
			const data = apiFeatures.filter().sort().limitFields().search(modelName);
			// calculating documents count
			const docsNum = (await data.mongooseQuery).length;
			// Appling pagination
			const { mongooseQuery, paginationResult } =
				apiFeatures.pagination(docsNum);
			// Ectracting the docs
			const docs: modelType[] = await mongooseQuery;
			// sending response
			res.status(200).json({
				length: docs.length,
				pagination: paginationResult,
				data: docs,
			});
		}
	);

export const getOne = <modeltype>(
	model: mongoose.Model<any>,
	population?: string
) =>
	asyncHandler(
		async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			let query = await model.findById(req.params.id);
			if (population) {
				query = query.populate(population);
			}
			const doc = await query;
			if (!doc) {
				return next(new ApiError("Document Not found", 404));
			}
			res.status(200).json({ data: doc });
		}
	);

export const createOne = <modeltype>(model: mongoose.Model<any>) =>
	asyncHandler(
		async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const doc = await model.create(req.body);
			res.status(201).json({ data: doc });
		}
	);

export const updateOne = <modeltype>(model: mongoose.Model<any>) =>
	asyncHandler(
		async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const doc = await model.findByIdAndUpdate(req.params.id, req.body, {
				new: true,
			});
			if (!doc) {
				return next(new ApiError("Document Not found", 404));
			}
			res.status(200).json({ data: doc });
		}
	);

export const deleteOne = <modeltype>(model: mongoose.Model<any>) =>
	asyncHandler(
		async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const doc = await model.findByIdAndDelete(req.params.id);
			if (!doc) {
				return next(new ApiError("Document Not found", 404));
			}
			res.status(200).json({ data: doc });
		}
	);
