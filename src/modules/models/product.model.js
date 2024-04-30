import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    product: {
      type: String,
      trim: true,
      minLength: 3,
      maxLength: 500,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      minLength: 3,
      maxLength: 500,
    },
    image: {
      type: String,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("product", productSchema);
export default Product;
