import express from "express";
import { 
  createOrder, 
  getMyOrders, 
  listOrders, 
  updateOrderStatus,
  cancelOrder
} from "../controller/orderController.js";

const router = express.Router();

// ✅ Create a new order
router.post("/", createOrder);

// ✅ Get all orders for the logged-in user
router.get("/my", getMyOrders);

// ✅ Cancel my order
router.put("/:id/cancel", cancelOrder);

// ✅ Admin only
router.get("/admin", listOrders);
router.put("/admin/:id/status", updateOrderStatus);

export default router;
