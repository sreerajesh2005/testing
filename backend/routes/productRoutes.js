import express from "express";
import {
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
} from "../controller/productController.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.get("/", listProducts);
router.post("/", upload.single("image"), createProduct);
router.get("/:id", getProduct);
router.put("/:id", upload.single("image"), updateProduct); // 👈 added update route
router.delete("/:id", deleteProduct);

export default router;
