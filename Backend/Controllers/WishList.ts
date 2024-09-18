import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import usersModel from "../Models/usersModel";
import wishlistRouter from "../Routers/WishList";

export const appProductToWishList = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const user = await usersModel.findByIdAndUpdate(
			req.user?._id,
			{
				$addToSet: { wishlist: req.body.product },
			},
			{ new: true }
		);
		res.status(200).json({ data: user?.wishlist });
	}
);

export const removeProductFromWishList = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const user = await usersModel.findByIdAndUpdate(
			req.user?._id,
			{
				$pull: { wishlist: req.params.product },
			},
			{ new: true }
		);
		res.status(200).json({ data: user?.wishlist });
	}
);

export const getLoggedUserWishList = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const user = await usersModel.findById(req.user?._id).populate("wishlist");
		res
			.status(200)
			.json({ length: user?.wishlist.length, data: user?.wishlist });
	}
);
