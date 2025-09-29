import cors from "cors";

const corsOptions = {
  origin: ["http://localhost:3001", "http://localhost:3000", "http://localhost:8080", "*"], 
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

export default () => cors(corsOptions);
