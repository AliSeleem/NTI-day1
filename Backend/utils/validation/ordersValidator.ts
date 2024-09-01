import { RequestHandler } from "express";
import { check } from "express-validator";
import validatorMiddleware from "../../Middleware/validatorMiddleware";

export const createOrderValidator: RequestHandler[] = [
	check("address").notEmpty().withMessage("Address is required"),
	validatorMiddleware,
];

export const getOrderValidator: RequestHandler[] = [
	check("id").isMongoId().withMessage("id must be a valid mongo id"),
	validatorMiddleware,
];
