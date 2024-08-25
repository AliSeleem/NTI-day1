import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

// env config
dotenv.config();

// app init
const app: express.Application = express();

// middleware
app.use(express.json());

// database connection
mongoose
	.connect(process.env.DB!)
	.then(() => {
		console.log(`Database connected to : ${process.env.DB}`);
	})
	.catch((err: Error) => {
		console.log(err);
	});

// main endpoint
app.get("/", (req: express.Request, res: express.Response) => {
	res.json({ msg: "Hello World!" });
});

// app listening
app.listen(process.env.PORT, () => {
	console.log(`Server is running on port ${process.env.PORT}`);
});
