import { Router } from "express";
import { authentecation, authorized } from "../../middlewares/auth.js";
import {
  createProduct,
  showSellerProducts,
} from "../controllers/products.controller.js";

const router = Router();

router.post("/create-product", authentecation, createProduct);
router.get("/show-products", authentecation, showSellerProducts);
export default router;
