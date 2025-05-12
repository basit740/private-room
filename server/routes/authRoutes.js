import express from "express";
import User from "../models/User.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

const router = express.Router();

// ➡️ Register
router.post("/register", async (req, res) => {
  const { email, name } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const user = await User.create({ email, name });
    res
      .status(201)
      .json({ message: "Registered successfully", userId: user._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ➡️ Request Magic Link - can be given to Admin
router.post("/request-login", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    user.magicToken = token;
    user.magicTokenExpiry = expiry;
    await user.save();

    // const loginLink = `https://privateroom.app/auth/magic-login/${token}`;
    const loginLink = `${process.env.APP_LINK}/auth/magic-login/${token}`;

    // Example email sender (set env vars)
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Your PrivateRoom login link",
      html: `<p>Click to login:</p><a href="${loginLink}">${loginLink}</a>`,
    });

    res.json({ message: "Login link sent to email" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ➡️ Magic Link Login
router.get("/magic-login/:token", async (req, res) => {
  const { token } = req.params;
  try {
    const user = await User.findOne({ magicToken: token });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired link" });

    // Clear token after login
    // user.magicToken = undefined;
    // user.magicTokenExpiry = undefined;
    // await user.save();

    // Create JWT token
    const jwtToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.json({
      message: "Login successful",
      name: user.name,
      userId: user._id,
      email: user.email,

      token: jwtToken,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
