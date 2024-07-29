import Product from "../models/product.model.js";
import { AppError, CatchError } from "../../utils/error.handler.js";
import { populate } from "dotenv";
import User from "../models/user.model.js";

export const productsController = {
  createProduct: CatchError(async (req, res, next) => {
    const { id } = req.user;

    const sellerIs = await User.findById(id);

    if (sellerIs.role !== "SELLER")
      throw new AppError("Unauthorized to Create Product", 403);

    const { product, price, description, image, quantity } = req.body;

    const createProduct = await Product.create({
      product,
      price,
      description,
      image,
      quantity,
      owner: id,
    });

    res.status(200).json({ product: createProduct });
  }),
  showSellerProducts: CatchError(async (req, res, next) => {
    const { id } = req.user;

    const seller = await User.findOne({ username: req.query.username });

    const getProducts = await Product.find({ owner: seller._id }).populate({
      path: "owner",
      select: ["username", "mobileNumber"],
    });

    if (!getProducts) {
      throw new Error("This seller have no products", 400);
    }

    res.status(200).json({ products: getProducts });
  }),
};
