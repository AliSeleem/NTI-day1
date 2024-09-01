import { Router } from "express";
import {
	createReview,
	deleteReview,
	filterReviews,
	getReviews,
	setProductAndUserId,
} from "../Controllers/Reviews";
import { allowedTo, checkActive, protectRoutes } from "../Controllers/auth";
import {
	createReviewValidator,
	deleteReviewValidator,
	getReviewValidator,
} from "../utils/validation/reviewsValidator";
import { updateCategoryValidator } from "../utils/validation/categoriesValidator";
import { updateCategory } from "../Controllers/Categories";

const ReviewsRouter: Router = Router({ mergeParams: true });

ReviewsRouter.route("/")
	.get(filterReviews, getReviews)
	.post(
		protectRoutes,
		checkActive,
		allowedTo("user"),
		setProductAndUserId,
		createReviewValidator,
		createReview
	);

ReviewsRouter.route("/:id")
	.get(getReviewValidator, getReviews)
	.put(
		protectRoutes,
		checkActive,
		allowedTo("user"),
		updateCategoryValidator,
		updateCategory
	)
	.delete(
		protectRoutes,
		checkActive,
		allowedTo("manager", "admin", "user"),
		deleteReviewValidator,
		deleteReview
	);

export default ReviewsRouter;
