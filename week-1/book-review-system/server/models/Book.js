import { Schema, model } from "mongoose";

const bookSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: String,
    genre: String,
    publishedYear: Number,
    user: {
      // add user field that references the User model
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Book = model("Book", bookSchema);
