import { Router } from "express";
import {
  signUp,
  signIn,
  verify,
  changePassword,
  recoveryPassword,
  resetPassword,
} from "../controllers/userAuth.controller.js";
import { updateUser, deleteUser } from "../controllers/user.controller.js";
import { authentecation, authorized } from "../middlewares/auth.js";
const router = Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.get("/verify/:token", verify);
router.patch("/change-password", authentecation, changePassword);
router.get("/recovery-password", recoveryPassword);
router.patch("/users/reset/:token", resetPassword);
router.put("/user/update", authentecation, updateUser);
router.delete("/user/delete", authentecation, deleteUser);

export default router;
