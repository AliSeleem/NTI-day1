import { model, Schema } from "mongoose";
import { Users } from "../interfaces/user";
import bcrypt from "bcryptjs";

const usersSchema: Schema = new Schema<Users>(
	{
		name: { type: String, required: true, trim: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true, minlength: 8, maxlength: 20 },
		image: { type: String, default: "user-default.jpeg" },
		role: {
			type: String,
			required: true,
			enum: ["admin", "user", "manager"],
			default: "user",
		},
		active: { type: Boolean, default: true },
		wishlist: [{ type: Schema.Types.ObjectId, ref: "products" }],
		passwordChangedAt: Date,
		resetCode: String,
		resetCodeExpireTime: Date,
		resetCodeVerify: Boolean,
		address: [{ type: String, trim: true }],
	},
	{ timestamps: true }
);

usersSchema.pre<Users>("save", async function (next) {
	if (!this.isModified("password")) {
		return next;
	}
	this.password = await bcrypt.hash(this.password, 13);
});

export default model<Users>("users", usersSchema);
