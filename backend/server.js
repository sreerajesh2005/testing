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
// import adminAuthRoutes from "./routes/adminAuthRoutes.js"; // enable when ready

dotenv.config();

// Connect MongoDB
connectDB();

const app = express();

// ✅ CORS: allow frontend origin (set FRONTEND_URL in .env for production)
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

// ✅ Middleware
app.use(cookieParser()); // parse cookies
app.use(express.json()); // parse JSON bodies

// ✅ Session (⚠️ MemoryStore is not for production)
// Use Redis/Mongo store if scaling beyond dev/demo
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret123",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Render health checks use HTTP, not HTTPS
      httpOnly: true,
      sameSite: "lax",
    },
  })
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Serve static uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ API Routes
app.use("/api/address", addressRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", userRoutes);
// app.use("/api/admin", adminAuthRoutes); // enable when admin routes ready

// ✅ Health check / root
app.get("/", (req, res) => {
  res.send("✅ API is running...");
});

// ✅ Use Render’s provided PORT
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
