import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import cartsModel from "../Models/CartsModel";
import ApiError from "../utils/ApiError";
import productsModel from "../Models/ProductModel";
import { CartProducts, Cart } from "../interfaces/Cart";
import { calcTotalPrice, priceAfterDiscount } from "../utils/pricing";
import CouponModel from "../Models/CouponModel";

//  Get User cart
export const getLoggedUserCart = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const cart = await cartsModel.findOne({ user: req.user?._id });
		if (!cart) {
			return next(new ApiError("this user don't have cart yet", 404));
		}
		res.status(200).json({ length: cart.cartItems.length, data: cart });
	}
);

//  Add Product To Cart
export const addProductToCart = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const product = await productsModel.findById(req.body.product);
		if (!product) {
			return next(new ApiError("product not found", 404));
		}
		let cart = await cartsModel.findOne({ user: req.user?._id });
		if (!cart) {
			cart = await cartsModel.create({
				user: req.user?._id,
				cartItems: [{ product: req.body.product._id, price: product.price }],
			});
		} else {
			const productIndex = cart.cartItems.findIndex(
				(item) => item.product.toString() === req.body.product._id.toString()
			);
			if (productIndex >= 0) {
				cart.cartItems[productIndex].quantity += 1;
			} else {
				cart.cartItems.push({
					product: req.body.product._id,
					price: product.price,
					quantity: 1,
				});
			}
		}
		calcTotalPrice(cart);
		await cart.save();
		res.status(200).json({ length: cart.cartItems.length, data: cart });
	}
);

// Remove Product from cart
export const removeProductFromCart = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const cart: any = await cartsModel.findOneAndUpdate(
			{ user: req.user?._id },
			{
				$pull: {
					cartItems: { product: req.body.product._id },
				},
			},
			{ new: true }
		);
		calcTotalPrice(cart);
		await cart.save();
		res.status(200).json({ length: cart.cartItems.length, data: cart });
	}
);

// Update product quantity
export const updateProductQuantity = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const cart = await cartsModel.findOne({ user: req.user?._id });
		if (!cart) {
			return next(new ApiError("cart not found", 404));
		}
		const productIndex = cart.cartItems.findIndex(
			(item) => item.product.toString() === req.body.product._id.toString()
		);
		if (productIndex >= 0) {
			cart.cartItems[productIndex].quantity = req.body.quantity;
		} else {
			return next(new ApiError("Product not found in cart", 404));
		}
		calcTotalPrice(cart);
		await cart.save();
		res.status(200).json({ length: cart.cartItems.length, data: cart });
	}
);

// Clear Cart
export const clearCart = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		await cartsModel.findOneAndDelete({ user: req.user?._id });
		res.status(204).json();
	}
);

// Apply coupon
export const applyCoupon = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const coupon = await CouponModel.findOne({
			name: req.body.name,
			expireTime: { $gt: Date.now() },
		});
		if (!coupon) {
			return next(new ApiError("Invalid coupon code", 400));
		}
		const cart = await cartsModel.findOne({ user: req.user?._id });
		if (!cart) {
			return next(new ApiError("cart not found", 404));
		}
		cart.totalPriceAfterDiscount = priceAfterDiscount(
			cart.totalPrice,
			coupon.discount
		);
		await cart.save();
		res.status(200).json({ length: cart.cartItems.length, data: cart });
	}
);
