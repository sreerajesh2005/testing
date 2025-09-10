// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import connectDB from "./config/db.js";
import path from "path";
import { fileURLToPath } from "url";

// Import Routes
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import addressRoutes from "./routes/addressRoutes.js";

dotenv.config();

// Connect MongoDB
connectDB();

const app = express();

// 🔹 Enable CORS for frontend
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true, // allow cookies
  })
);

// 🔹 Middleware
app.use(cookieParser());
app.use(express.json());

// 🔹 Session middleware (only if you’re actually using sessions)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret123",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // only secure in production
      httpOnly: true,
    },
  })
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔹 Serve static uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 🔹 API Routes
app.use("/api/address", addressRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", userRoutes);

// ✅ Root route
app.get("/", (req, res) => {
  res.send("✅ API is running...");
});

// ✅ Production: Serve frontend build (if deploying both frontend + backend together)
if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "/frontend/build")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  );
}

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
