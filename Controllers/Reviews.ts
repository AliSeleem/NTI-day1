import { NextFunction, Request, Response } from "express";
import { FilterData } from "../interfaces/filterData";
import { reviews } from "../interfaces/reviews";
import ReviewsModel from "../Models/ReviewsModel";
import {
	createOne,
	deleteOne,
	getAll,
	getOne,
	updateOne,
} from "./refactorHandler";

export const filterReviews = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	let filterData: FilterData = {};
	if (req.params.productId) {
		filterData.product = req.params.productId;
	}
	req.filterData = filterData;
	next();
};

export const setProductAndUserId = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (!req.body.product) {
		req.body.product = req.params.productId;
	}
	if (!req.body.user) {
		req.body.user = req.user?._id;
	}
	next();
};

export const createReview = createOne<reviews>(ReviewsModel);
export const getReviews = getAll<reviews>(ReviewsModel, "reviews");
export const getReview = getOne<reviews>(ReviewsModel);
export const updateReview = updateOne<reviews>(ReviewsModel);
export const deleteReview = deleteOne<reviews>(ReviewsModel);
