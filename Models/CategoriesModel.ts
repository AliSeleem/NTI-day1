import { model, Schema } from "mongoose";
import { Categories } from "../interfaces/Categories";

const CategoriesSchema = new Schema<Categories>({
	name: { type: String, required: true, unique: true },
});

export default model("Categories", CategoriesSchema);
