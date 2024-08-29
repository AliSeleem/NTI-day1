import { Document } from "mongoose";

export interface Users extends Document {
	email: string;
	password: string;
	name: string;
	image: string;
	role: "manager" | "admin" | "user";
	active: boolean;
	passwordChangedAt: Date | number;
	resetCode: string;
	resetCodeExpireTime: Date | number;
	resetCodeVerify: boolean;
}
