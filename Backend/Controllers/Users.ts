import { Request, Response, NextFunction } from "express";
import { Users } from "../interfaces/user";
import usersModel from "../Models/usersModel";
import { createOne, deleteOne, getAll, getOne } from "./refactorHandler";
import asyncHandler from "express-async-handler";
import ApiError from "../utils/ApiError";
import { uploadSingleImage } from "../Middleware/uploadImages";
import sharp from "sharp";
import bcrypt from "bcryptjs";
import { createToken } from "../utils/createToken";

//  defualt CRUD operations -But without U-
export const getUsers = getAll<Users>(usersModel, "users");
export const getUser = getOne<Users>(usersModel);
export const createUser = createOne<Users>(usersModel);
export const deleteUser = deleteOne<Users>(usersModel);

//  Custom update operations
export const updateUser = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const { id } = req.params;
		const { name, image, active } = req.body;
		const user = await usersModel.findByIdAndUpdate(
			id,
			{
				name: name,
				image: image,
				active: active,
			},
			{ new: true }
		);
		if (!user) {
			return next(new ApiError("User not found", 404));
		}
		res.status(200).json({ data: user, message: "user updated successfully" });
	}
);

export const uploadUserImage = uploadSingleImage("image");

export const resizeUserImage = asyncHandler(async (req, res, next) => {
	if (req.file) {
		const imageName: string = `user-${Date.now()}.jpeg`;
		await sharp(req.file.buffer)
			.toFormat("jpeg")
			.jpeg({ quality: 95 })
			.toFile(`uploads/users/${imageName}`);
		req.body.image = imageName;
	}
	next();
});

export const changeUserPassword = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const user = await usersModel.findByIdAndUpdate(
			req.params.id,
			{
				password: await bcrypt.hash(req.body.password, 13),
				passwordChangedAt: Date.now(),
			},
			{ new: true }
		);
		if (!user) {
			return next(new ApiError("User not found", 404));
		}
		res
			.status(200)
			.json({ data: user, message: "Password updated successfully" });
	}
);

// Logged users operations
export const setLoggedUserId = asyncHandler(
	(req: Request, res: Response, next: NextFunction) => {
		req.params.id = req.user?._id!.toString();
		next();
	}
);

export const updateLoggedUser = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const user = await usersModel.findByIdAndUpdate(
			req.user?._id,
			{
				name: req.body.name,
				image: req.body.image,
			},
			{ new: true }
		);
		res.status(200).json({ data: user, message: "user updated successfully" });
	}
);

export const changeLoggedUserPassword = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const user = await usersModel.findByIdAndUpdate(
			req.user?._id,
			{
				password: await bcrypt.hash(req.body.password, 13),
				passwordChangedAt: Date.now(),
			},
			{ new: true }
		);
		const token: string = createToken(user?._id, user?.role!);
		res.status(200).json({ message: "password changed successfully", token });
	}
);
