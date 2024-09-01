import { Router } from "express";
import { allowedTo, checkActive, protectRoutes } from "../Controllers/auth";
import {
	createOrder,
	filterOrders,
	getOrder,
	getAllOrders,
	updateOrderDelivered,
	updateOrderPaid,
} from "../Controllers/Orders";
import {
	createOrderValidator,
	getOrderValidator,
} from "../utils/validation/ordersValidator";

const ordersRouter: Router = Router();

ordersRouter.use(protectRoutes, checkActive);

ordersRouter
	.route("/")
	.get(filterOrders, getAllOrders)
	.post(allowedTo("user"), createOrderValidator, createOrder);

ordersRouter.route(":id").get(getOrderValidator, getOrder);

ordersRouter.put("/:id/delivered", getOrderValidator, updateOrderDelivered);
ordersRouter.put("/:id/paid", getOrderValidator, updateOrderPaid);

export default ordersRouter;
