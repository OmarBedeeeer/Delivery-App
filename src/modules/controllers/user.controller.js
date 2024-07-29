import User from "../models/user.model.js";
import { AppError, CatchError } from "../../utils/error.handler.js";

export const userController = {
  updateUser: CatchError(async (req, res, next) => {
    const { id } = req.user;
    const updateUser = await User.findByIdAndUpdate(
      id,
      {
        ...req.body,
      },
      { new: true }
    );

    if (!updateUser) {
      throw new AppError("User not found", 400);
    }
    res.status(200).json({ user: updateUser });
  }),
  deleteUser: CatchError(async (req, res, next) => {
    const { id } = req.user;

    const deleteUser = await User.findByIdAndDelete(id);
    if (!deleteUser) {
      throw new AppError("User not found", 400);
    }
    res.status(200).json({ deleted: deleteUser });
  }),
};
