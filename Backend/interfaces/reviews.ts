import { Document } from "mongoose";
import { Users } from "./user";
import { Product } from "./product";

export interface reviews extends Document {
	comment: string;
	rating: number;
	user: Users;
	product: Product;
}
