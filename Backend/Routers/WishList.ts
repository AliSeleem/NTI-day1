import { Router } from "express";
import { allowedTo, checkActive, protectRoutes } from "../Controllers/auth";
import {
	appProductToWishList,
	getLoggedUserWishList,
	removeProductFromWishList,
} from "../Controllers/WishList";

const wishlistRouter: Router = Router();

wishlistRouter.use(protectRoutes, allowedTo("user"), checkActive);

wishlistRouter.route("/").get(getLoggedUserWishList).post(appProductToWishList);

wishlistRouter.route(":product").delete(removeProductFromWishList);

export default wishlistRouter;
