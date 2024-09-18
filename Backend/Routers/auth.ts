import { Router } from "express";
import {
	forgetPassword,
	login,
	resetCode,
	signup,
	verifyResetCode,
} from "../Controllers/auth";
import {
	loginValidator,
	resetCodeValidator,
	sendMailValidator,
	signupValidator,
} from "../utils/validation/authValidator";
const authRouter = Router();

authRouter.route("/signup").post(signupValidator, signup);
authRouter.route("/login").post(loginValidator, login);
authRouter.route("/forgetPassword").post(sendMailValidator, forgetPassword);
authRouter.route("/verifyCode").post(verifyResetCode);
authRouter.route("/resetCode").put(resetCodeValidator, resetCode);

export default authRouter;
