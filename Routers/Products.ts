import express from "express";
import {
	deleteProduct,
	createProduct,
	getProducts,
	getProduct,
	updateProduct,
} from "../Controllers/Products";
import {
	createProductValidator,
	deleteProductValidator,
	getProductValidator,
	updateProductValidator,
} from "../utils/validation/productsValidator";
const CategoriesRouter = express.Router();

CategoriesRouter.route("/")
	.get(getProducts)
	.post(createProductValidator, createProduct);
CategoriesRouter.route("/:id")
	.get(getProductValidator, getProduct)
	.put(updateProductValidator, updateProduct)
	.delete(deleteProductValidator, deleteProduct);

export default CategoriesRouter;
