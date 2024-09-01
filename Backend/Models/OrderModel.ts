import { model, Schema } from "mongoose";
import { Order } from "../interfaces/Order";

const OrderSchema: Schema = new Schema<Order>(
	{
		cartItems: [
			{
				product: { type: Schema.Types.ObjectId, ref: "products" },
				price: Number,
				quantity: { type: Number, default: 1 },
			},
		],
		totalPrice: Number,
		paymentMethod: { type: String, enum: ["cash", "card"], default: "cash" },
		deliveredAt: Date,
		isDelivered: { type: Boolean, default: false },
		paidAt: Date,
		isPaid: { type: Boolean, default: false },
		taxPrice: { type: Number, default: 0 },
		address: { type: String, required: true },
		user: { type: Schema.Types.ObjectId, red: "users" },
	},
	{ timestamps: true }
);

OrderSchema.pre<Order>(/^find/, function (next) {
	this.populate({ path: "cartItems.product", select: "name cover" });
	this.populate({ path: "user", select: "name image email" });
	next();
});

export default model<Order>("orders", OrderSchema);
