import { RequestHandler } from "express";
import { check } from "express-validator";
import validatorMiddleware from "../../Middleware/validatorMiddleware";
import CouponModel from "../../Models/CouponModel";

// Create coupon validator
export const createCouponValidator: RequestHandler[] = [
	check("name")
		.notEmpty()
		.withMessage("name is required")
		.isLength({ min: 2, max: 50 })
		.withMessage("name must be between 3 and 50 ")
		.custom(async (val) => {
			const coupon = await CouponModel.findOne({ name: val });
			if (coupon) {
				return new Error("Coupon name already exists");
			}
			return true;
		}),
	check("expireTime")
		.isDate()
		.withMessage("expireTime must be a date")
		.notEmpty()
		.withMessage("expireTime is required"),
	check("discount")
		.notEmpty()
		.withMessage("discount is required")
		.isNumeric()
		.withMessage("discount must be a Number")
		.custom((val) => {
			if (val <= 0 || val > 100) {
				return new Error("discount must be between 1 and 100");
			}
			return true;
		}),
	validatorMiddleware,
];

// Update coupon validator
export const updateCouponValidator: RequestHandler[] = [
	check("name")
		.optional()
		.isLength({ min: 2, max: 50 })
		.withMessage("name must be between 3 and 50 "),
	check("expireTime")
		.optional()
		.isDate()
		.withMessage("expireTime must be a date"),
	check("discount")
		.optional() // ! هي المفروض تبقا اختياري كده
		.isNumeric()
		.withMessage("discount must be a Number")
		.custom((val) => {
			if (val <= 0 || val > 100) {
				return new Error("discount must be between 1 and 100");
			}
			return true;
		}),
	validatorMiddleware,
];

// Get coupon validator
export const getCouponValidator: RequestHandler[] = [
	check("id").isMongoId().withMessage("id must be a valid MongoDB ObjectId"),
	validatorMiddleware,
];

// Delete coupon validator
export const deleteCouponValidator: RequestHandler[] = [
	check("id").isMongoId().withMessage("id must be a valid MongoDB ObjectId"),
	validatorMiddleware,
];
