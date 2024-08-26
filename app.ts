import express from "express";
import dotenv from "dotenv";
import DBInit from "./Config/DB";
import mountRoutes from "./Routers";
import { Server } from "http";

// env config
dotenv.config();

// app init
const app: express.Application = express();
let server: Server;
// middleware
app.use(express.json());

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
