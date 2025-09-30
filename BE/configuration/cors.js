import cors from "cors";

const corsOptions = {
  origin: [
    "https://echo-store-nu.vercel.app", 
    "http://localhost:3000", 
    "http://localhost:8080",
    // Allow all ngrok URLs
    /^https:\/\/.*\.ngrok-free\.app$/,
    /^https:\/\/.*\.ngrok\.io$/,
    /^https:\/\/.*\.ngrok\.app$/
  ], 
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
  allowedHeaders: [
    "Content-Type", 
    "Authorization", 
    "ngrok-skip-browser-warning",
    "Accept",
    "Origin",
    "X-Requested-With"
  ],
};

export default () => cors(corsOptions);
