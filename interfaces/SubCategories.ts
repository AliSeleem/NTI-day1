import { Categories } from "./Categories";
import { Document } from "mongoose";

export interface SubCategories extends Document {
	name: string;
	category: Categories;
	image: string;
}
