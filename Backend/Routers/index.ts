import * as all from "../interfaces";
import { Application, NextFunction, Request, Response } from "express";
import CategoriesRouter from "./Categories";
import SubCategoriesRouter from "./SubCategories";
import ProductsRouter from "./Products";
import ApiError from "../utils/ApiError";
import globalErrors from "../Middleware/globalErrors";
import usersRouter from "./Users";
import authRouter from "./auth";
import ReviewsRouter from "./Reviews";
import wishlistRouter from "./WishList";
import ordersRouter from "./Orders";

const mountRoutes = (app: Application) => {
	app.use("/api/v1/categories", CategoriesRouter);
	app.use("/api/v1/subcategories", SubCategoriesRouter);
	app.use("/api/v1/products", ProductsRouter);
	app.use("/api/v1/reviews", ReviewsRouter);
	app.use("/api/v1/orders", ordersRouter);
	app.use("/api/v1/wishlist", wishlistRouter);
	app.use("/api/v1/auth", authRouter);
	app.use("/api/v1/users", usersRouter);

	app.all("*", (req: Request, res: Response, next: NextFunction) => {
		{
			next(new ApiError(`the router ${req.originalUrl} is not found`, 400));
		}
	});
	app.use(globalErrors);
};

export default mountRoutes;
