import { model, Schema } from "mongoose";
import { Cart } from "../interfaces/Cart";

const CartsSchema: Schema = new Schema<Cart>(
	{
		cartItems: [
			{
				product: { type: Schema.Types.ObjectId, ref: "products" },
				quantity: { type: Number, default: 1 },
				price: Number,
			},
		],
		totalPrice: { type: Number, required: true },
		totalPriceAfterDiscount: { type: Number, required: true },
		user: { type: Schema.Types.ObjectId, ref: "users" },
	},
	{ timestamps: true }
);

CartsSchema.pre<Cart>(/^find/, function (next) {
	this.populate({ path: "cartItems.product", select: "name cover" });
	next();
});

export default model<Cart>("carts", CartsSchema);
