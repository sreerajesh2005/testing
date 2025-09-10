import Cart from "../model/Cart.js";

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ message: "Not logged in" });

    const { productId, quantity } = req.body;
    if (!productId) return res.status(400).json({ message: "Product ID required" });

    let cartItem = await Cart.findOne({ userId, productId });
    if (cartItem) {
      cartItem.quantity += quantity || 1;
    } else {
      cartItem = new Cart({ userId, productId, quantity: quantity || 1 });
    }

    await cartItem.save();
    res.status(201).json(cartItem);
  } catch (err) {
    console.error("AddToCart Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get cart items
export const getCart = async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ message: "Not logged in" });

    const cart = await Cart.find({ userId }).populate("productId");
    res.json(cart);
  } catch (err) {
    console.error("GetCart Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Update quantity
export const updateCart = async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ message: "Not logged in" });

    const { quantity } = req.body;
    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    const cartItem = await Cart.findOneAndUpdate(
      { _id: req.params.id, userId },
      { quantity },
      { new: true }
    ).populate("productId");

    if (!cartItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json(cartItem);
  } catch (err) {
    console.error("UpdateCart Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ message: "Not logged in" });

    const cartItem = await Cart.findOneAndDelete({ _id: req.params.id, userId });
    if (!cartItem) return res.status(404).json({ message: "Item not found" });

    res.json({ message: "Item removed from cart" });
  } catch (err) {
    console.error("RemoveFromCart Error:", err);
    res.status(500).json({ message: err.message });
  }
};
