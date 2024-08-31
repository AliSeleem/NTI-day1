import { Router } from "express";
import { allowedTo, checkActive, protectRoutes } from "../Controllers/auth";
import {
	addProductToCart,
	applyCoupon,
	// applyCoupon,
	clearCart,
	getLoggedUserCart,
	removeProductFromCart,
	updateProductQuantity,
} from "../Controllers/Carts";
import {
	addProductToCartValidator,
	removeProductFromCartValidator,
	updateProductQuantityValidator,
} from "../utils/validation/CartsValidator";

const CartsRouter: Router = Router();

CartsRouter.use(protectRoutes, checkActive, allowedTo("user"));

CartsRouter.route("/")
	.get(getLoggedUserCart)
	.post(addProductToCartValidator, addProductToCart)
	.delete(clearCart);

CartsRouter.put("/applyCoupon", applyCoupon);

CartsRouter.route("/:itemId")
	.put(updateProductQuantityValidator, updateProductQuantity)
	.delete(removeProductFromCartValidator, removeProductFromCart);

export default CartsRouter;
