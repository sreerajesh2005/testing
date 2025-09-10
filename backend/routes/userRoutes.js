import express from "express";
import { register, login, logout, getCurrentUser, getUsers, updateProfile } from "../controller/userController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", getCurrentUser);
router.get("/users", getUsers);
router.put("/profile", updateProfile); // ✅ Edit profile

export default router;
