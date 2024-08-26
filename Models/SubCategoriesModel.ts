import { model, Schema } from "mongoose";
import { SubCategories } from "../interfaces/SubCategories";

const SubCategoriesSchema = new Schema<SubCategories>({
	name: { type: String, required: true, unique: true },
});

export default model("SubCategories", SubCategoriesSchema);
