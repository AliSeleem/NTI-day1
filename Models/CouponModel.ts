import { model, Schema } from "mongoose";
import { Coupon } from "../interfaces/Coupon";

const CouponSchema: Schema = new Schema<Coupon>(
	{
		name: { type: String, required: true, trim: true, unique: true },
		expireTime: { type: Date, required: true },
		discount: { type: Number, required: true, min: 1, max: 100 },
	},
	{ timestamps: true }
);

export default model<Coupon>("coupons", CouponSchema);
