import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import sendmail from "../../utils/email.sender.js";
import { AppError, CatchError } from "../../utils/error.handler.js";

export const signUp = CatchError(async (req, res, next) => {
  const { password } = req.body;

  const findUser = await User.findOne({ email: req.body.email });
  if (findUser) {
    throw new AppError("User already exists", 400);
  }

  // const token = jwt.sign(
  //   { id: findUser?._id, email: req.body.email },
  //   process.env.SECRET_KEY,
  //   {
  //     expiresIn: "10min",
  //   }
  // );

  // const link = `http://localhost:3000/verify/${token}`;

  // await sendmail({
  //   to: req.body.email,
  //   subject: "Verify your account",
  //   text: link,
  // });

  const hashingPassword = await bcryptjs.hash(password, 7);

  const user = await User.create({
    ...req.body,
    password: hashingPassword,
  });

  res.status(201).json({ user });
});

export const signIn = CatchError(async (req, res, next) => {
  const { email, password } = req.body;
  const findUser = await User.findOne({ email /*isVerified: true*/ });
  if (!findUser) {
    throw new AppError("User not found", 400);
  }

  const comparePassword = await bcryptjs.compare(password, findUser.password);
  if (!comparePassword) {
    throw new AppError("Wrong Email Or password", 400);
  }

  const token = jwt.sign(
    {
      id: findUser._id,
      email,
      role: findUser.role,
      totalSpinding: findUser.totalSpinding,
      username: findUser.username,
    },
    process.env.SECRET_KEY,
    {
      expiresIn: "1d",
    }
  );

  res.status(200).json({ token, user: findUser });
});

export const verify = CatchError(async (req, res, next) => {
  const { token } = req.params;
  const decode = jwt.verify(token, process.env.SECRET_KEY);

  const user = await User.findOne({ email: decode.email });

  user.isVerified = true;

  user.save();

  res.status(200).json({ msg: "verified" });
});

export const changePassword = CatchError(async (req, res, next) => {
  const { newPassword, bodyPass } = req.body;

  const user = await User.findById(req.user.id);

  const comparePassword = await bcryptjs.compare(bodyPass, user.password);

  if (!comparePassword) {
    throw new AppError("Wrong password, please try again", 400);
  }

  const hashingPassword = await bcryptjs.hash(newPassword, 7);

  user.password = hashingPassword;

  await user.save();

  res.status(200).json({ msg: "password changed successfully" });
});

export const recoveryPassword = CatchError(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("User not found", 400);
  }

  const token = jwt.sign({ email }, process.env.SECRET_KEY, {
    expiresIn: "10min",
  });

  const forgetPasswordLink = `http://localhost:3000/users/reset/${token}`;

  const sendmailer = await sendmail({
    to: email,
    subject: "Reset your password",
    text: forgetPasswordLink,
  });
  res.status(200).json({ message: "Email sent successfully" });
});

export const resetPassword = CatchError(async (req, res) => {
  const { token } = req.params;

  const { email } = jwt.verify(token, process.env.SECRET_KEY);

  const { newPassword } = req.body;

  const hashedPassword = await bcryptjs.hash(
    newPassword,
    parseInt(process.env.ROUNDS)
  );

  const updatePassword = await User.findOneAndUpdate(
    { email },
    { password: hashedPassword }
  );

  res.status(200).json({ message: "Password reset successfully" });
});
