import { RequestHandler } from "express";
import { check } from "express-validator";
import validatorMiddleware from "../../Middleware/validatorMiddleware";

// Add product to cart validator
export const addProductToCartValidator: RequestHandler[] = [
	check("product")
		.notEmpty()
		.withMessage("Product is required")
		.isMongoId()
		.withMessage("Invalid product ID"),
	validatorMiddleware,
];

// Remove product from cart validator
export const removeProductFromCartValidator: RequestHandler[] = [
	check("itemId").isMongoId().withMessage("Invalid Mongo ID"),
	validatorMiddleware,
];

// Update product quantity validator
export const updateProductQuantityValidator: RequestHandler[] = [
	check("itemId").isMongoId().withMessage("Invalid Mongo ID"),
	check("quantity")
		.notEmpty()
		.withMessage("Quantity is required")
		.isNumeric()
		.withMessage("Quantity must be a number")
		.custom((val) => {
			if (val <= 0) throw new Error("Quantity must be greater than 0");
			return true;
		}),
	validatorMiddleware,
];
