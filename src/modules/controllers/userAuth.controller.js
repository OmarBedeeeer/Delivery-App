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

  const token = jwt.sign(
    { id: findUser?._id, email: req.body.email },
    process.env.SECRET_KEY,
    {
      expiresIn: "10min",
    }
  );

  const link = `http://localhost:3000/verify/${token}`;

  await sendmail({
    to: req.body.email,
    subject: "Verify your account",
    text: link,
  });

  const hashingPassword = await bcryptjs.hash(password, 7);

  const user = await User.create({
    ...req.body,
    password: hashingPassword,
  });

  res.status(201).json({ user });
});

export const signIn = CatchError(async (req, res, next) => {
  const { email, password } = req.body;
  const findUser = await User.findOne({ email, verified: true });
  if (!findUser) {
    throw new AppError("User not found", 400);
  }

  const comparePassword = await bcryptjs.compare(password, findUser.password);
  if (!comparePassword) {
    throw new AppError("Wrong Email Or password", 400);
  }

  const token = jwt.sign({ id: findUser._id }, process.env.SECRET_KEY, {
    expiresIn: "1d",
  });

  res.status(200).json({ token, user: findUser });
});

export const verify = CatchError(async (req, res, next) => {
  const { token } = req.params;
  const decode = jwt.verify(token, process.env.SECRET_KEY);
  const user = await User.findOne({ email: decode.email });
  console.log(user);
  user.save();
  res.status(200).json({ msg: "verified" });
});
