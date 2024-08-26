import { Application, NextFunction, Request, Response } from "express";
import CategoriesRouter from "./Categories";
import SubCategoriesRouter from "./SubCategories";
import ApiError from "../utils/ApiError";
import globalErrors from "../Middleware/globalErrors";

const mountRoutes = (app: Application) => {
	app.use("/api/v1/categories", CategoriesRouter);
	app.use("/api/v1/subcategories", SubCategoriesRouter);
	app.all("*", (req: Request, res: Response, next: NextFunction) => {
		{
			next(new ApiError(`the router ${req.originalUrl} is not found`, 400));
		}
	});
	app.use(globalErrors);
};

export default mountRoutes;
