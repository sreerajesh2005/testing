import express from "express";
import {
  saveAddress,
  getAddressById,
  getAddresses,
  getAllAddresses,
  updateAddress,
  deleteAddress,
} from "../controller/addressController.js";
// import { protect, isAdmin } from "../middleware/authMiddleware.js"; // if you want admin protection

const router = express.Router();

// ✅ User routes
router.post("/", saveAddress);             // Save address
router.get("/", getAddresses);             // Get addresses for logged-in user

// ✅ Admin route (placed above :id so it's not shadowed)
// Add `protect, isAdmin` middleware when ready
router.get("/admin", getAllAddresses);     

// ✅ Param routes
router.get("/:id", getAddressById);        // Get single address
router.put("/:id", updateAddress);         // Update address
router.delete("/:id", deleteAddress);      // Delete address

export default router;

