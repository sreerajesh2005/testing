import User from "../model/User.js";
import bcrypt from "bcrypt";

// ✅ Register User
export const register = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    // Check if email exists
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Check if mobile exists
    const mobileExists = await User.findOne({ mobile });
    if (mobileExists) {
      return res.status(400).json({ message: "Mobile number already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save new user
    const user = new User({ name, email, mobile, password: hashedPassword });
    await user.save();

    // Exclude password in response
    const { password: _, ...safeUser } = user.toObject();
    res.status(201).json({ message: "User registered successfully", user: safeUser });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Login User (email or mobile)
export const login = async (req, res) => {
  const { email, mobile, password } = req.body;

  try {
    // Allow login with either email or mobile
    const user = await User.findOne({
      $or: [{ email }, { mobile }],
    });

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Store session
    req.session.userId = user._id;

    res.json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        cart: user.cart || [],
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Logout
export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out successfully" });
  });
};

// ✅ Get Current User
export const getCurrentUser = async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not logged in" });
    }

    const user = await User.findById(req.session.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("GetCurrentUser error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Update Profile
export const updateProfile = async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not logged in" });
    }

    const { name, email, mobile, password } = req.body;
    const updateData = {};

    // Duplicate email check
    if (email) {
      const emailExists = await User.findOne({ email, _id: { $ne: req.session.userId } });
      if (emailExists) {
        return res.status(400).json({ message: "Email already in use" });
      }
      updateData.email = email;
    }

    // Duplicate mobile check
    if (mobile) {
      const mobileExists = await User.findOne({ mobile, _id: { $ne: req.session.userId } });
      if (mobileExists) {
        return res.status(400).json({ message: "Mobile number already in use" });
      }
      updateData.mobile = mobile;
    }

    if (name) updateData.name = name;

    // Update password if provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.session.userId,
      { $set: updateData },
      { new: true, runValidators: true, select: "-password" }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (err) {
    console.error("UpdateProfile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get All Users (admin use later)
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error("GetUsers error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
