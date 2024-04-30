import { Router } from "express";
import { authentecation, authorized } from "../middlewares/auth.js";
import { addToCart, confirmCart } from "../controllers/cart.controller.js";

const router = Router();

router.put("/show-products/:productId/add-to-cart", authentecation, addToCart);
router.put("/cart/confirm", authentecation, confirmCart);
export default router;
