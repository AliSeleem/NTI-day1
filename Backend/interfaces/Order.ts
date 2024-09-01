import { Document } from "mongoose";
import { Cart, CartProducts } from "./Cart";
import { Users } from "./user";

export interface Order extends Document {
	cartItems: CartProducts;
	totalPrice: number;
	paymentMethod: "cash" | "card";
	deliveredAt: Date | number;
	isDelivered: boolean;
	paidAt: Date | number;
	isPaid: boolean;
	taxPrice: number;
	address: string;
	user: Users;
}
