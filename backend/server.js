const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const menuRoutes = require("./routes/menuRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Restaurant Management API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);

// Multer errors, including invalid file type and file size
app.use((err, req, res, next) => {
  if (err instanceof require("multer").MulterError) {
    return res.status(400).json({
      success: false,
      message:
        err.code === "LIMIT_FILE_SIZE"
          ? "Image size must not exceed 5 MB."
          : err.message,
    });
  }

  if (
    err.message === "Only JPG, PNG and WEBP images are allowed."
  ) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  console.error("Server error:", err.message);

  return res.status(500).json({
    success: false,
    message: "An unexpected server error occurred.",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

