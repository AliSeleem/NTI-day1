import { model, Schema } from "mongoose";
import { reviews } from "../interfaces/reviews";
import ProductModel from "./ProductModel";

// Define the reviews schema
const reviewsSchema: Schema<reviews> = new Schema<reviews>(
	{
		comment: { type: String, required: true },
		rating: { type: Number, required: true, min: 1, max: 5 },
		user: { type: Schema.Types.ObjectId, ref: "users", required: true },
		product: { type: Schema.Types.ObjectId, ref: "products", required: true },
	},
	{ timestamps: true }
);

// Static method to calculate rating and quantity
reviewsSchema.statics.calcRatingAndQuantity = async function (
	productId: string
) {
	const result = await this.aggregate([
		{ $match: { product: productId } },
		{
			$group: {
				_id: "product",
				avgRating: { $avg: "$rating" },
				ratesCount: { $sum: 1 },
			},
		},
	]);

	// Update the product's rating and quantity if reviews exist
	if (result.length > 0) {
		await ProductModel.findByIdAndUpdate(productId, {
			ratesCount: result[0].ratesCount,
			ratingAverage: result[0].avgRating,
		});
	} else {
		// Reset rating and count if no reviews
		await ProductModel.findByIdAndUpdate(productId, {
			ratesCount: 0,
			ratingAverage: 0,
		});
	}
};

// Post hook after deleting a review
reviewsSchema.post("findOneAndDelete", async function (result) {
	const doc = result; // 'value' contains the deleted document
	if (doc && doc.product) {
		// Directly call the static method from the model
		await (this.model as any).calcRatingAndQuantity(doc.product._id);
	}
});

// Post hook after updating a review
reviewsSchema.post("findOneAndUpdate", async function (result) {
	const doc = result; // findOneAndUpdate returns the updated document directly
	if (doc && doc.product) {
		// Directly call the static method from the model
		await (this.model as any).calcRatingAndQuantity(doc.product._id);
	}
});

// Post hook after saving a new review
reviewsSchema.post<reviews>("save", async function () {
	// Call the static method directly
	await (this.constructor as any).calcRatingAndQuantity(this.product);
});

// Pre hooks to populate user and product
reviewsSchema.pre<reviews>(/^find/, function (next) {
	this.populate({ path: "user", select: "name image" });
	this.populate({ path: "product", select: "name cover" });
	next();
});

export default model<reviews>("reviews", reviewsSchema);
