import express from "express";
import mongoose from "mongoose";
import { Book } from "./models/Book.js"; // Adjust the path as necessary
import { Review } from "./models/Review.js"; // Adjust the path as necessary
import cors from "cors";
import { User } from "./models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { verifyToken } from "./middleware/auth-token.js";

const app = express();
app.use(express.json());
app.use(cors());

// node -e "console.log(require('crypto').randomBytes(32).toString('hex'));"
const JWT_SECRET =
  "d6bc6d9a1dec3427d744d6fe045b2cfaab1b8acadcc871cfd8e523ab1e67c24b";
const MONGO_URI = "mongodb://localhost:27017/letphil-lvl4";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.get("/protected", verifyToken, (req, res) => {
  res.json({
    message: "This is a protected route!",
    user: req.user,
    timestamp: new Date().toISOString(),
  });
});

app.post("/books", verifyToken, async (req, res) => {
  try {
    const bookData = {
      ...req.body,
      user: req.user.userId,
    };

    const book = new Book(bookData);
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/books", verifyToken, async (req, res) => {
  try {
    const books = await Book.find({ user: req.user.userId });
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/books/:id", async (req, res) => {
  // Get a single book by ID and populate reviews
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/books/:id/reviews", async (req, res) => {
  try {
    const reviews = await Review.find({ book: req.params.id }).sort({
      createdAt: -1,
    }); // Sort by newest first

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/reviews", async (req, res) => {
  try {
    const review = new Review(req.body);
    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: "invalid email or password" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password || "");
    if (!isValidPassword) {
      return res.status(400).json({ error: "invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token: token,
      user,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/signup", async (req, res) => {
  try {
    const { username, password, interests } = req.body;

    if (!username && !password) {
      return res.status(400).json({ error: "unable to create account" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "email already exists " });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      password: hashedPassword,
      interests,
    });

    await user.save();

    res.status(201).json({
      message: "user created successfully",
      user: {
        _id: user._id,
        username: user.username,
        password: user.password,
        email: user.email,
        interests: user.interests,
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
