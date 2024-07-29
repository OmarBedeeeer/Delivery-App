import { Router } from "express";
import { authentecation, authorized } from "../../middlewares/auth.js";
import { cartController } from "../controllers/cart.controller.js";

const router = Router();

router.put(
  "/show-products/:productId/add-to-cart",
  authentecation,
  cartController.addToCart
);
router.put("/cart/confirm", authentecation, cartController.confirmCart);
export default router;
