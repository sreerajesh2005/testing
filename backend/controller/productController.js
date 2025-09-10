import Product from "../model/Product.js";

// Normalize image URL (always full URL)
const normalizeImage = (req, product) => {
  if (!product) return null;
  if (!product.image) return { ...product._doc, image: null };
  if (product.image.startsWith("http")) return product;

  return {
    ...product._doc,
    image: `${req.protocol}://${req.get("host")}${product.image}`,
  };
};

// List all products
export const listProducts = async (req, res) => {
  try {
    let products = await Product.find().sort({ createdAt: -1 });
    products = products.map((p) => normalizeImage(req, p));
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products", error: err.message });
  }
};

// Create a new product
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ message: "Name, price, and category are required" });
    }

    const product = new Product({
      name,
      description: description || "",
      price: Number(price),
      category,
      stock: stock ? Number(stock) : 0,
      image: req.file ? `/uploads/${req.file.filename}` : null,
    });

    await product.save();
    res.status(201).json(normalizeImage(req, product));
  } catch (err) {
    res.status(500).json({ message: "Failed to create product", error: err.message });
  }
};

// Update a product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const updates = {};
    if (req.body.name) updates.name = req.body.name;
    if (req.body.description) updates.description = req.body.description;
    if (req.body.price !== undefined) updates.price = Number(req.body.price);
    if (req.body.category) updates.category = req.body.category;
    if (req.body.stock !== undefined) updates.stock = Number(req.body.stock);
    if (req.file) updates.image = `/uploads/${req.file.filename}`;

    const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedProduct) return res.status(404).json({ message: "Product not found" });

    res.json(normalizeImage(req, updatedProduct));
  } catch (err) {
    res.status(500).json({ message: "Failed to update product", error: err.message });
  }
};

// Delete a product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete product", error: err.message });
  }
};

// Get a single product
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(normalizeImage(req, product));
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch product", error: err.message });
  }
}; 
