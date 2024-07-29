import { Router } from "express";
import { authentecation, authorized } from "../../middlewares/auth.js";
import { productsController } from "../controllers/products.controller.js";

const router = Router();

router.post(
  "/create-product",
  authentecation,
  productsController.createProduct
);
router.get(
  "/show-products",
  authentecation,
  productsController.showSellerProducts
);
export default router;
