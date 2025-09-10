import express from "express";
import { addToCart, getCart, removeFromCart, updateCart } from "../controller/cartController.js";

const router = express.Router();

const requireLogin = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Not logged in" });
  }
  next();
};

router.use(requireLogin);

router.post("/add", addToCart);
router.get("/", getCart);
router.put("/:id", updateCart);   // ✅ new update route
router.delete("/:id", removeFromCart);

export default router;
