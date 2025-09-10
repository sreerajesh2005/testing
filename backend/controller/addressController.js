import Address from "../model/Address.js";

/**
 * ✅ Save Address (session-based)
 */
export const saveAddress = async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized - Please log in" });

    const requiredFields = ["name", "mobile", "addressLine1", "city", "state", "pincode"];
    for (let field of requiredFields) {
      if (!req.body[field]) return res.status(400).json({ error: `${field} is required` });
    }

    const address = await Address.create({ ...req.body, userId });
    res.status(201).json(address);
  } catch (err) {
    console.error("Address Save Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * ✅ Get single address by ID
 */
export const getAddressById = async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized - Please log in" });

    const address = await Address.findOne({ _id: req.params.id, userId });
    if (!address) return res.status(404).json({ error: "Address not found" });

    res.json(address);
  } catch (err) {
    console.error("Get Address Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * ✅ Get all addresses for logged-in user
 */
export const getAddresses = async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized - Please log in" });

    const addresses = await Address.find({ userId });
    res.json(addresses);
  } catch (err) {
    console.error("Get Addresses Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * ✅ Get all addresses (Admin route)
 */
export const getAllAddresses = async (req, res) => {
  try {
    // Optional: Check if user is admin
    if (!req.session.isAdmin) {
      return res.status(403).json({ error: "Forbidden - Admins only" });
    }

    const addresses = await Address.find().populate("userId", "_id name email");
    res.json(addresses);
  } catch (err) {
    console.error("Get All Addresses Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * ✅ Update address
 */
export const updateAddress = async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized - Please log in" });

    const address = await Address.findOneAndUpdate(
      { _id: req.params.id, userId },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!address) return res.status(404).json({ error: "Address not found" });

    res.json(address);
  } catch (err) {
    console.error("Update Address Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * ✅ Delete address
 */
export const deleteAddress = async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized - Please log in" });

    const address = await Address.findOneAndDelete({ _id: req.params.id, userId });
    if (!address) return res.status(404).json({ error: "Address not found" });

    res.json({ message: "Address deleted successfully" });
  } catch (err) {
    console.error("Delete Address Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
