import { model, Schema } from "mongoose";
import { reviews } from "../interfaces/reviews";
import ProductModel from "./ProductModel";

const reviewsSchema: Schema = new Schema<reviews>(
	{
		comment: { type: String, required: true },
		rating: { type: Number, required: true, min: 1, max: 5 },
		user: { type: Schema.Types.ObjectId, ref: "users", required: true },
		product: { type: Schema.Types.ObjectId, ref: "products", required: true },
	},
	{ timestamps: true }
);

reviewsSchema.statics.calcRatingAndquantity = async function (productId) {
	const result = await this.aggregate([
		{ $match: { product: productId } },
		{
			$group: {
				_id: "product",
				avgRating: { $avg: "$rating" },
				ratingquantity: { $sum: 1 },
			},
		},
	]);
	if (result.length > 0) {
		await ProductModel.findByIdAndUpdate(productId, {
			ratesCount: result[0].ratingquantity,
			ratingAverage: result[0].avgRating,
		});
	} else {
		await ProductModel.findByIdAndUpdate(productId, {
			ratesCount: 0,
			ratingAverage: 0,
		});
	}
};

reviewsSchema.post<reviews>("save", async function () {
	await (this.constructor as any).calcRatingAndquantity(this.product);
});

reviewsSchema.pre<reviews>(/^find/, async function (next) {
	this.populate({ path: "user", select: "name imag" });
	next();
});

export default model<reviews>("reviews", reviewsSchema);
