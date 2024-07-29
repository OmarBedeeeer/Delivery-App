import { Router } from "express";
import { userAuthController } from "../controllers/userAuth.controller.js";
import { userController } from "../controllers/user.controller.js";
import { authentecation, authorized } from "../../middlewares/auth.js";
const router = Router();

router.post("/signup", userAuthController.signUp);
router.post("/signin", userAuthController.signIn);
router.get("/verify/:token", userAuthController.verify);
router.patch(
  "/change-password",
  authentecation,
  userAuthController.changePassword
);
router.get("/recovery-password", userAuthController.recoveryPassword);
router.patch("/users/reset/:token", userAuthController.resetPassword);
router.put("/user/update", authentecation, userController.updateUser);
router.delete("/user/delete", authentecation, userController.deleteUser);

export default router;
