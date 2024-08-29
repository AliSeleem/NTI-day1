import { model, Schema } from "mongoose";
import { Users } from "../interfaces/user";
import bcrypt from "bcryptjs";

const usersSchema: Schema = new Schema<Users>(
	{
		name: { type: String, required: true, trim: true },
		email: { type: String, required: true, trim: true, unique: true },
		password: { type: String, required: true, minlength: 8, maxlength: 20 },
		role: {
			type: String,
			required: true,
			enum: ["admin", "user", "manager"],
			default: "user",
		},
		image: String,
		active: { type: Boolean, default: true },
		passwordChangedAt: Date,
		resetCode: String,
		resetCodeExpireTime: Date,
		resetCodeVerify: Boolean,
	},
	{ timestamps: true }
);

const imageUrl = (doc: Users) => {
	if (doc.image) {
		const imageUrl: string = `${process.env.BASE_URL}/users/${doc.image}`;
		doc.image = imageUrl;
	}
};

usersSchema.post("init", (doc: Users) => {
	imageUrl(doc);
});

usersSchema.pre<Users>("save", async function (next) {
	if (!this.isModified("password")) {
		return next;
	}
	this.password = await bcrypt.hash(this.password, 13);
});

export default model<Users>("users", usersSchema);
