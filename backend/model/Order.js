import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    addressId: { type: mongoose.Schema.Types.ObjectId, ref: "Address", required: true },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1 },
        price: Number,
      },
    ],
    totals: {
      subtotal: Number,
      tax: Number,
      shipping: Number,
      total: Number,
    },
    paymentMethod: {
      type: String,
      enum: ["UPI", "Card", "NetBanking", "COD"],
      required: true,
    },
    paymentDetails: {
      bankName: String,    // for NetBanking or Card
      cardNumber: String,  // masked card number
      upiId: String,       // for UPI
    },
    paymentStatus: { type: String, default: "Pending" },
    status: { type: String, default: "Processing" },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
