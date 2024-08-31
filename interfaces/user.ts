import { Document } from "mongoose";
import { Product } from "./product";

export interface Users extends Document {
	email: string;
	password: string;
	name: string;
	image: string;
	role: "manager" | "admin" | "user";
	active: boolean;
	wishlist: Product[];
	passwordChangedAt: Date | number;
	resetCode: string | undefined;
	resetCodeExpireTime: Date | number | undefined;
	resetCodeVerify: boolean | undefined;
	address: string[];
}
