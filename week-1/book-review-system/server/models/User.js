import mongoose, { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    username: String,
    firstName: String,
    lastName: String,
    interests: [String],
    favoriteBooks: [
      {
        title: String,
        author: String,
      },
    ],
    password: String,
  },
  {
    timestamps: true,
  }
);

export const User = model("User", userSchema);
