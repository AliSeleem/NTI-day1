import { Document, Schema } from "mongoose";

export interface Product extends Document {
	name: string;
	description: string;
	price: number;
	priceAfterDiscount: number;
	quantity: number;
	sold: number;
	ratingAverage: number;
	ratesCount: number;
	cover: string;
	images: string[];
	category: Schema.Types.ObjectId;
	subCategory: Schema.Types.ObjectId;
}
