import { Router } from "express";
import { signUp, signIn, verify } from "../controllers/userAuth.controller.js";

const router = Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.get("/verify/:token", verify);

export default router;
