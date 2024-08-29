import { Router } from "express";
import { login, signup } from "../Controllers/auth";
import {loginValidator, signupValidator} from"../utils/validation/authValidator"
const authRoute = Router();

authRoute.route("/signup").post(signupValidator, signup);
authRoute.route("/login").post(loginValidator, login);
export default authRoute;
