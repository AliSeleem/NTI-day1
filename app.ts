import express, { Request } from "express";
import dotenv from "dotenv";
import DBInit from "./Config/DB";
// import cookieParser from "cookie-parser";
// import { doubleCsrf } from "csrf-csrf";
import compression from "compression";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import hpp from "hpp";
import cors from "cors";
import mountRoutes from "./Routers";
import { Server } from "http";

// env config
dotenv.config();

// app init
const app: express.Application = express();
let server: Server;

// Static files Route
app.use(express.static("uploads"));

// Security middleware
app.use(express.json({ limit: "10kb" }));
app.use(
	cors({
		origin: ["http://localhost:4200"],
		methods: ["POST", "GET", "PUT", "DELETE"],
		allowedHeaders: ["Content-Type", "Authorization"],
		credentials: true,
	})
);
app.use(compression());
app.use(mongoSanitize());
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(
	hpp({
		whitelist: ["price", "category", "subcategory", "ratingAverage", "sold"],
	})
);

/*
			////! CSRF-CSRF

Link: https://www.npmjs.com/package/csrf-csrf
install: npm i csrf-csrf

app.use(cookieParser());

			////! Set up csrf-csrf middleware

const { generateToken, doubleCsrfProtection } = doubleCsrf({
	getSecret: (req: Request) => req.cookies["csrfSecret"], // Where to get the secret
	cookieName: "csrfSecret", // Name of the cookie to store the secret
	cookieOptions: { httpOnly: true, sameSite: "Strict", secure: true }, // Cookie settings
	getTokenFromRequest: (req) => req.body.csrfToken, // Where to find the CSRF token in the request
});

			////! Middleware to generate CSRF token and set it in cookies

app.use((req, res, next) => {
	const csrfSecret = req.cookies["csrfSecret"] || generateToken();
	res.cookie("csrfSecret", csrfSecret, {
		httpOnly: true,
		sameSite: "Strict",
		secure: true,
	});
	res.locals.csrfToken = generateToken(csrfSecret);
	next();
});

*/

// database connection
DBInit();

// main endpoint
mountRoutes(app);

// app listening
server = app.listen(process.env.PORT, () => {
	console.log(`Server is running on http://localhost:${process.env.PORT}/`);
});

process.on("unhandledRejection", (err: Error) => {
	console.error(`unhandledRejection ${err.name} | ${err.message}`);
	server.close(() => {
		console.error("shutting the application down");
		process.exit(1);
	});
});
