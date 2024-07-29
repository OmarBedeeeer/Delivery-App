import Cart from "../models/cart.model.js";
import User from "../models/user.model.js";
import { AppError, CatchError } from "../../utils/error.handler.js";
import Product from "../models/product.model.js";

export const cartController = {
  addToCart: CatchError(async (req, res, next) => {
    const { id } = req.user;

    const { quantity } = req.body.products[0];

    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (quantity > product.quantity) {
      return res.status(400).json({ message: "Quantity is not available" });
    }

    const cart = await Cart.findOne({ user: id });
    if (!cart) {
      await Cart.create({ user: id });
      throw new AppError("Please REfresh the Page", 400);
    }
    const existingProduct = cart.products.find((x) => x.product == productId);
    if (existingProduct) {
      existingProduct.quantity += quantity;
      existingProduct.cost += product.price * quantity;
      if (existingProduct.quantity > product.quantity) {
        return res.status(400).json({ message: "Quantity is not available" });
      }
    } else {
      cart.products.push({
        product: product._id,
        quantity,
        cost: product.price * quantity,
      });
    }

    await cart.save();

    const totalProducts = cart.products.reduce((x, y) => x + y.cost, 0);

    let delivery = 15;

    if (totalProducts > 1000) {
      delivery = 0;
    }

    const total = totalProducts + delivery;

    res.status(200).json({ cart, totalProducts, delivery, total });
  }),

  showCart: CatchError(async (req, res, next) => {
    const { id } = req.user;
    const cart = await Cart.findOne({ user: id }).populate(
      "products.product.product"
    );
    res.status(200).json({ cart });
  }),

  confirmCart: CatchError(async (req, res, next) => {
    const { id } = req.user;

    const cart = await Cart.findOne({ user: id }).populate(
      "products.product.product"
    );

    // if (!cart || !cart.products.length) {
    //   throw new AppError("Cart is empty", 404);
    // }
    const productIds = cart.products.map((product) => product.product._id);

    const products = await Product.find({ _id: { $in: productIds } });

    const totalUserPaid = cart.products.reduce(
      (total, product) => total + product.cost,
      0
    );

    const user = await User.findByIdAndUpdate(
      id,
      { totalSpinding: req.user.totalSpinding + totalUserPaid },
      { new: true }
    );

    user.save();

    await Promise.all(
      cart.products.map(async (cartProduct) => {
        const product = products.find(
          (p) => p._id.toString() === cartProduct.product._id.toString()
        );
        if (product) {
          product.quantity -= cartProduct.quantity;
          await product.save();
        }
      })
    );

    await Cart.findOneAndUpdate({ user: id }, { $set: { products: [] } });

    res.status(200).json({ message: "Cart confirmed successfully" });
  }),
};
