import { Document } from "mongoose";

export interface Coupon extends Document {
	name: string;
	expireTime: Date;
	discount: number;
}
