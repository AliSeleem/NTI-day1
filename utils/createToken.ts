import Jwt from "jsonwebtoken";

export const createToken = (payload: any) =>
	Jwt.sign({ _id: payload }, process.env.JWT_SECRET_KEY!, {
		expiresIn: process.env.JWT_EXPIRED_TIME,
	});
