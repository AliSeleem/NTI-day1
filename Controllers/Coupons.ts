import { Coupon } from "../interfaces/Coupon";
import CouponModel from "../Models/CouponModel";
import {
	createOne,
	deleteOne,
	getAll,
	getOne,
	updateOne,
} from "./refactorHandler";

export const createCoupon = createOne<Coupon>(CouponModel);
export const getCoupon = getOne<Coupon>(CouponModel);
export const getCoupons = getAll<Coupon>(CouponModel, "coupons" );
export const deleteCoupon = deleteOne<Coupon>(CouponModel);
export const updateCoupon = updateOne<Coupon>(CouponModel);
