import express from "express";
import {
	deleteProduct,
	createProduct,
	getProducts,
	getProduct,
	updateProduct,
	uploadProductImages,
	resizeImages,
} from "../Controllers/Products";
import {
	createProductValidator,
	deleteProductValidator,
	getProductValidator,
	updateProductValidator,
} from "../utils/validation/productsValidator";
import { allowedTo, checkActive, protectRoutes } from "../Controllers/auth";
const ProductsRouter = express.Router();

ProductsRouter.route("/")
	.get(getProducts)
	.post(
		protectRoutes,
		checkActive,
		allowedTo("manager", "admin"),
		uploadProductImages,
		resizeImages,
		createProductValidator,
		createProduct
	);
ProductsRouter.route("/:id")
	.get(getProductValidator, getProduct)
	.put(
		protectRoutes,
		checkActive,
		allowedTo("manager", "admin"),
		updateProductValidator,
		updateProduct
	)
	.delete(
		protectRoutes,
		checkActive,
		allowedTo("manager", "admin"),
		deleteProductValidator,
		deleteProduct
	);

export default ProductsRouter;
