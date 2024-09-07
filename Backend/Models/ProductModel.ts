import { model, Schema } from "mongoose";
import { Product } from "../interfaces/product";

const productSchema: Schema = new Schema<Product>(
	{
		name: { type: String, required: true, trim: true },
		description: {
			type: String,
			required: true,
			trim: true,
			minlength: 10,
			maxlength: 50,
		},
		price: { type: Number, required: true, min: 1, max: 1000000 },
		priceAfterDiscount: { type: Number, required: true, min: 1, max: 1000000 },
		quantity: { type: Number, default: 0, min: 0 },
		sold: { type: Number, default: 0 },
		ratingAverage: { type: Number, min: 0, max: 5 },
		ratesCount: { type: Number, default: 0, min: 0 },
		cover: String,
		images: [String],
		category: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "categories",
		},
		subCategory: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "subcategories",
		},
	},
	{ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

productSchema.virtual("reviews", {
	ref: "reviews",
	foreignField: "product",
	localField: "_id",
});

// const imageUrl = (doc: Product) => {
// 	if (doc.cover) {
// 		const imageUrl: string = `${process.env.BASE_URL}/products/${doc.cover}`;
// 		doc.cover = imageUrl;
// 	}
// 	if (doc.images) {
// 		const imgesList: string[] = [];
// 		doc.images.forEach((image: string) => {
// 			const imageUrl: string = `${process.env.BASE_URL}/products/${image}`;
// 			imgesList.push(imageUrl);
// 		});
// 		doc.images = imgesList;
// 	}
// };

// productSchema
// 	.post("init", (doc: Product) => imageUrl(doc))
// 	.post("save", (doc: Product) => imageUrl(doc));

productSchema.pre<Product>(/^find/, function (next) {
	this.populate({ path: "category", select: "name" });
	this.populate({ path: "subCategory", select: "name" });
	next();
});

export default model<Product>("products", productSchema);
