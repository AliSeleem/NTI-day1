import { Cart, CartProducts } from "../interfaces/Cart";

export const calcTotalPrice = (cart: Cart): number => {
	let totalPrice: number = 0;
	cart.cartItems.forEach((item: CartProducts) => {
		totalPrice += item.quantity * item.price;
	});
	cart.totalPrice = totalPrice;
	cart.totalPriceAfterDiscount = undefined;
	return totalPrice;
};

export const priceAfterDiscount = (total: number, discount: number): number => {
	return total - (total * discount) / 100;
};
