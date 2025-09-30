import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import connectDB from "./configuration/db_connection.js";
import "./configuration/redis_connection.js"; // Initialize Redis connection
import corsMiddleware from "./configuration/cors.js";
import userRouter from "./router/userRouter.js";
import productRouter from "./router/productRouter.js";
import ngrok from "@ngrok/ngrok";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(corsMiddleware())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files with proper CORS headers
app.use("/uploads", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Cache-Control", "public, max-age=31536000"); // Cache for 1 year
  next();
}, express.static("uploads"));

connectDB();
app.use(userRouter);
app.use("/product", productRouter);

app.get("/", (req, res) => {
  res.end("server created ");
});

app.listen(port, async () => {
  console.log(`Server running on ${port}`);
  try {
    const listener = await ngrok.connect({ 
      addr: port, 
      authtoken_from_env: true 
    });
    console.log(`Ingress established at: ${listener.url()}`);
  } catch (error) {
    console.error('Failed to establish ngrok tunnel:', error);
  }
});
