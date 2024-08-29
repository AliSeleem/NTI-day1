import { Router } from "express";
import { login, signup } from "../Controllers/auth";
const authRoute = Router();

authRoute.route("/signup").post(signup);
authRoute.route("/login").post(login);
export default authRoute;
