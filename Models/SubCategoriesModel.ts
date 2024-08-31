import { model, Schema } from "mongoose";
import { SubCategories } from "../interfaces/SubCategories";

const subCategoriesSchema: Schema = new Schema<SubCategories>(
	{
		name: { type: String, required: true, trim: true, unique: true },
		category: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "categories",
		},
		image: String,
	},
	{ timestamps: true }
);

subCategoriesSchema.pre<SubCategories>(/^find/, function (next) {
	this.populate({ path: "category", select: "name" });
	next();
});

export default model("SubCategories", subCategoriesSchema);
