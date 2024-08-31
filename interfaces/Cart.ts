import { Document } from "mongoose";
import { Product } from "./product";
import { Users } from "./user";

export interface CartProducts {
	product: Product;
	quantity: number;
	price: number;
}

export interface Cart extends Document {
	cartItems: CartProducts[];
	totalPrice: number;
	totalPriceAfterDiscount: number | undefined;
	user: Users;
}
