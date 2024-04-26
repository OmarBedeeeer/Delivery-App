import mongoose from "mongoose";
const Userschema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      minLength: 3,
      maxLength: 500,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN", "SELLER"],
      default: "USER",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    adress: {
      type: String,
      trim: true,
      minLength: 3,
      maxLength: 500,
      required: true,
    },
    profilePic: {
      type: String,
    },
    totalSpinding: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("user", Userschema);
export default User;
