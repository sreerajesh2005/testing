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
// import adminAuthRoutes from "./routes/adminAuthRoutes.js"; // <-- new admin auth routes

dotenv.config();

// Connect MongoDB
connectDB();

const app = express();

// CORS: allow frontend origin (change FRONTEND_URL in .env for production)
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true, // allow cookies
  })
);

// parse cookies (needed for HttpOnly cookie auth)
app.use(cookieParser());

// JSON body parser
app.use(express.json());

// Session middleware (optional - you already had this)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret123",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production" }, // secure only on https
  })
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// static uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Public / user routes
app.use("/api/address", addressRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", userRoutes);

// Admin auth routes (register/login/me/logout for admin)
// app.use("/api/admin", adminAuthRoutes);

/* 
  NOTE:
  - Protect admin-only API endpoints using your auth middleware.
  - Example (in the route file or here) for protecting admin order list:
      import { protect, isAdmin } from './middleware/authMiddleware.js';
      app.get('/api/orders/admin', protect, isAdmin, adminController.getAllOrders);

  Make sure you created:
    - backend/routes/adminAuthRoutes.js
    - backend/controllers/adminAuthController.js
    - backend/middleware/authMiddleware.js
    - updated backend/models/User.js (add `role` field)
  See previous snippets I gave for those files if you haven't created them yet.
*/

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
