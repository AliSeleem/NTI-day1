import ordersModel from "../Models/OrderModel";
import { Order } from "../interfaces/Order";
import { getAll, getOne } from "./refactorHandler";
import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import CartsModel from "../Models/CartsModel";
import ApiError from "../utils/ApiError";
import { CartProducts } from "../interfaces/Cart";
import ProductsModel from "../Models/ProductModel";
import OrderModel from "../Models/OrderModel";

// Filer orders
export const filterOrders = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	if (req.user?.role === "user") {
		req.filterData = { user: req.user._id };
	}
	next();
};

// Get all orders
export const getAllOrders = getAll<Order>(ordersModel, "orders");

// Get order
export const getOrder = getOne<Order>(ordersModel);

// Create order
export const createOrder = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		// 0 tax price
		const taxPrice = 100;
		// 1 Get user cart
		const cart = await CartsModel.findOne({ user: req.user?._id });
		if (!cart) {
			return next(new ApiError("cart not found", 404));
		}
		// 2 Get order price
		const orderPrice = cart.totalPriceAfterDiscount
			? cart.totalPriceAfterDiscount
			: cart.totalPrice;
		const totalPrice = orderPrice - taxPrice;
		// 3 create order
		const order = await ordersModel.create({
			user: req.user?._id,
			totalPrice,
			taxPrice,
			address: req.body.address,
			cartItems: cart.cartItems,
		});
		// 4 update product quantity and sold, and delete cart
		if (order) {
			const bulkOptions = cart.cartItems.map((item: CartProducts) => ({
				updateOne: {
					filter: { _id: item.product._id },
					update: { $inc: { quantity: -item.quantity, sold: item.quantity } },
				},
			}));
			await ProductsModel.bulkWrite(bulkOptions);
			await CartsModel.findByIdAndDelete(cart._id);
		}
		res.status(201).json({ data: order });
	}
);

// Update order [isPaid, isDelivered]
export const updateOrderPaid = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const order = await OrderModel.findByIdAndUpdate(
			req.params.id,
			{
				isPaid: true,
				paidAt: Date.now(),
			},
			{ new: true }
		);
		if (!order) next(new ApiError("Order Not found", 404));
		res.status(200).json({ data: order });
	}
);

export const updateOrderDelivered = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const order = await OrderModel.findByIdAndUpdate(
			req.params.id,
			{
				isDelivered: true,
				deliveredAt: Date.now(),
			},
			{ new: true }
		);
		if (!order) next(new ApiError("Order Not found", 404));
		res.status(200).json({ data: order });
	}
);
