import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import connectDB from "./configuration/db_connection.js";
import corsMiddleware from "./configuration/cors.js";
import userRouter from "./router/userRouter.js";
import productRouter from "./router/productRouter.js";

dotenv.config();

const app = express();
const port = process.env.PUBLIC_PORT;

app.use(corsMiddleware())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/uploads", express.static("uploads"));

connectDB();
app.use(userRouter);
app.use("/product", productRouter);

app.get("/", (req, res) => {
  res.end("server created ");
});

app.listen(port, () => {
  console.log(`Sever running on ${port}`);
});
