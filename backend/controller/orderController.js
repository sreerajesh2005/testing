import Order from "../model/Order.js";
import Address from "../model/Address.js";

// ✅ Create new order
export const createOrder = async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ message: "Not logged in" });

    const { items, totals, addressId, paymentMethod, paymentDetails } = req.body;

    // --- Validation ---
    if (!items?.length) {
      return res.status(400).json({ message: "Cart is empty" });
    }
    if (!addressId) {
      return res.status(400).json({ message: "Address ID is required" });
    }
    if (!totals) {
      return res.status(400).json({ message: "Totals are required" });
    }
    if (!["UPI", "Card", "NetBanking", "COD"].includes(paymentMethod)) {
      return res.status(400).json({ message: "Invalid payment method" });
    }

    const address = await Address.findOne({ _id: addressId, userId });
    if (!address) {
      return res.status(400).json({ message: "Invalid address" });
    }

    // --- Create order ---
    const order = new Order({
      userId,
      addressId: address._id,
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity || 1,
        price: item.price,
      })),
      totals,
      paymentMethod,
      paymentDetails: paymentDetails || {},
      paymentStatus: paymentMethod === "COD" ? "Pending" : "Paid",
      status: "Processing",
    });

    await order.save();

    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (err) {
    console.error("❌ createOrder error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get orders for logged-in user
export const getMyOrders = async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ message: "Not logged in" });

    const orders = await Order.find({ userId })
      .populate("items.productId")
      .populate("addressId")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Admin: list all orders
export const listOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("items.productId","name image")
      .populate("addressId")
      .populate("userId", "name email mobile")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Admin: update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = req.body.status || order.status;
    await order.save();

    res.json({ message: "Order status updated", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ User: cancel their own order
export const cancelOrder = async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ message: "Not logged in" });

    const order = await Order.findOne({ _id: req.params.id, userId });
    if (!order) return res.status(404).json({ message: "Order not found" });

    // prevent cancelling if already delivered/refunded/cancelled
    if (["Delivered", "Refunded", "Cancelled"].includes(order.status)) {
      return res.status(400).json({ message: `Cannot cancel order in status: ${order.status}` });
    }

    order.status = "Cancelled";
    await order.save();

    res.json({ message: "Order cancelled successfully", order });
  } catch (err) {
    console.error("❌ cancelOrder error:", err);
    res.status(500).json({ message: err.message });
  }
};

