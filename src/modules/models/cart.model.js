import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
      },
      cost: {
        type: Number,
        required: true,
      },
    },
  ],
});

const Cart = mongoose.model("cart", cartSchema);
export default Cart;
