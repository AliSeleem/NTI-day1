import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import Jwt from "jsonwebtoken";
import { Users } from "../interfaces/user";
import usersModel from "../Models/usersModel";
import ApiError from "../utils/ApiError";
import { createResetToken, createToken } from "../utils/createToken";
import { sendMail } from "../utils/sendMail";

export const signup = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const user: Users = await usersModel.create(req.body);
		const token = createToken(user._id);
		res.status(201).json({ data: user, token });
	}
);

export const login = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const user = await usersModel.findOne({ email: req.body.email });
		if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
			return next(new ApiError("Invalid email or password", 401));
		}
		const token = createToken(user._id);
		res.status(200).json({ message: "logged in successfully", token });
	}
);

export const protectRoutes = asyncHandler(
	async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		// 1- check if token found
		let token: string = "";
		if (req.headers.authorization?.startsWith("Bearer")) {
			token = req.headers.authorization.split(" ")[1];
		} else {
			return next(new ApiError("login first to access the application", 401));
		}

		// 2- check if token not expired
		const decodedToken: any = Jwt.verify(token, process.env.JWT_SECRET_KEY!);

		// 3- check if user exist
		const currentUser = await usersModel.findById(decodedToken._id);
		if (!currentUser) {
			return next(new ApiError("user doesn't exist", 401));
		}
		// 4- check if password changed
		if (currentUser.passwordChangedAt instanceof Date) {
			const changedPasswordTime: number =
				currentUser.passwordChangedAt.getTime() / 1000;
			if (changedPasswordTime > decodedToken.iat) {
				return next(new ApiError("please login again", 401));
			}
		}
		req.user = currentUser;
		next();
	}
);

export const allowedTo = (...roles: string[]) =>
	asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
		if (!roles.includes(req.user?.role ?? "")) {
			return next(
				new ApiError("you don't have permission to perform this action", 403)
			);
		}
		next();
	});

export const checkActive = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		if (req.user?.active) {
			return next(new ApiError("your account is not active", 403));
		}
		next();
	}
);

export const forgetPassword = asyncHandler(
	async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		const user = await usersModel.findOne({ email: req.body.email });
		if (!user) {
			return next(new ApiError(`user not found`, 404));
		}
		const resetcode: string = Math.floor(
			100000 + Math.random() * 900000
		).toString();
		user.resetCode = crypto
			.createHash("sha256")
			.update(resetcode)
			.digest("hex");
		user.resetCodeExpireTime = Date.now() + 10 * 60 * 1000;
		user.resetCodeVerify = false;
		const message: string = `your reset password code is ${resetcode}`;
		try {
			await sendMail({ email: user.email, subject: "reset password", message });
			await user.save({ validateModifiedOnly: true });
		} catch (error) {
			console.error(error);
			return next(new ApiError("error sending email", 500));
		}
		const resetToken = createResetToken(user._id);
		res.json({ message: "reset password code sent to your email", resetToken });
	}
);

export const verifyResetCode = asyncHandler(
	async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		let resetToken: string = "";
		if (
			req.headers.authorization &&
			req.headers.authorization.startsWith("bearer")
		) {
			resetToken = req.headers.authorization.split(" ")[1];
		} else {
			return next(new ApiError("get your reset code first", 400));
		}
		const decodedToken: any = Jwt.verify(
			resetToken,
			process.env.JWT_SECRET_KEY
		);
		const hashedResetcCode: string = crypto
			.createHash("sha256")
			.update(req.body.resetCode)
			.digest("hex");
		const user = await usersModel.findOne({
			_id: decodedToken.id,
			resetCode: hashedResetcCode,
			resetCodeExpireTime: { $gt: Date.now() },
		});
		if (!user) {
			return next(new ApiError("invalid reset code", 400));
		}
		user.resetCodeVerify = true;
		await user.save({ validateModifiedOnly: true });
		res.status(200).json({ message: "reset code verified" });
	}
);

export const resetCode = asyncHandler(
	async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		let resetToken: string = "";
		if (
			req.headers.authorization &&
			req.headers.authorization.startsWith("Bearer")
		) {
			resetToken = req.headers.authorization.split(" ")[1];
		} else {
			return next(new ApiError("you can't do this action", 400));
		}
		const decodedToken: any = Jwt.verify(
			resetToken,
			process.env.JWT_SECRET_KEY!
		);
		const user = await usersModel.findOne({
			_id: decodedToken._id,
			resetCodeVerify: true,
		});
		if (!user) {
			return next(new ApiError("verify your reset code first", 400));
		}
		user.password = req.body.password;
		user.resetCode = undefined;
		user.resetCodeExpireTime = undefined;
		user.resetCodeVerify = undefined;
		user.passwordChangedAt = Date.now();
		await user.save({ validateModifiedOnly: true });
		res.status(200).json({ message: "your password has been changed" });
	}
);
