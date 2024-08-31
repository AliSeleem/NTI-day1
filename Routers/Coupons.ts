import { Router } from "express";
import { allowedTo, checkActive, protectRoutes } from "../Controllers/auth";
import {
	createCoupon,
	deleteCoupon,
	getCoupon,
	getCoupons,
	updateCoupon,
} from "../Controllers/Coupons";
import {
	createCouponValidator,
	deleteCouponValidator,
	getCouponValidator,
	updateCouponValidator,
} from "../utils/validation/CouponsValidator";

const CouponRouter: Router = Router();

CouponRouter.use(protectRoutes, checkActive, allowedTo("manager", "admin"));

CouponRouter.route("/")
	.get(getCoupons)
	.post(createCouponValidator, createCoupon);

CouponRouter.route("/:id")
	.get(getCoupon)
	.put(updateCouponValidator, updateCoupon)
	.delete(deleteCouponValidator, deleteCoupon);

export default CouponRouter;
