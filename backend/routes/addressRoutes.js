import express from "express";
import {
  saveAddress,
  getAddressById,
  getAddresses,
  getAllAddresses,
  updateAddress,
  deleteAddress,
} from "../controller/addressController.js";

const router = express.Router();

// User routes
router.post("/", saveAddress);             // Save address
router.get("/", getAddresses);            // Get addresses for logged-in user
router.get("/:id", getAddressById);       // Get single address
router.put("/:id", updateAddress);        // Update address
router.delete("/:id", deleteAddress);     // Delete address

// Admin route
router.get("/admin", getAllAddresses);    // Get all addresses for admin

export default router;
