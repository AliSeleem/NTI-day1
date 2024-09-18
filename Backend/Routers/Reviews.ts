import { Router } from "express";
import {
	createReview,
	deleteReview,
	filterReviews,
	getReview,
	getReviews,
	setProductAndUserId,
	updateReview,
} from "../Controllers/Reviews";
import { allowedTo, checkActive, protectRoutes } from "../Controllers/auth";
import {
	createReviewValidator,
	deleteReviewValidator,
	getReviewValidator,
	updateReviewValidator,
} from "../utils/validation/reviewsValidator";

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

ReviewsRouter.route("/myReviews").get(
	protectRoutes,
	checkActive,
	allowedTo("user"),
	filterReviews,
	getReviews
);

ReviewsRouter.route("/:id")
	.get(getReviewValidator, getReview)
	.put(
		protectRoutes,
		checkActive,
		allowedTo("user"),
		updateReviewValidator,
		updateReview
	)
	.delete(
		protectRoutes,
		checkActive,
		allowedTo("manager", "admin", "user"),
		deleteReviewValidator,
		deleteReview
	);

export default ReviewsRouter;
