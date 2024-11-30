const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load User model
const User = require("../../models/User");

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", async (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  try {
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      return res.status(400).json({ email: "Email already exists" });
    }

    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    // Hash password before saving in database
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);
    const savedUser = await newUser.save();

    res.json(savedUser);
  } catch (error) {
    console.error("Error registering user:", error.message);
    res.status(500).json({ error: "Failed to register user" });
  }
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", async (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      // User matched, create JWT Payload
      const payload = { id: user.id, name: user.name };

      // Sign token
      const token = jwt.sign(payload, keys.secretOrKey, { expiresIn: "1y" }); // Token valid for 1 year
      return res.json({ success: true, token: "Bearer " + token });
    } else {
      return res.status(400).json({ passwordincorrect: "Password incorrect" });
    }
  } catch (error) {
    console.error("Error logging in user:", error.message);
    res.status(500).json({ error: "Failed to log in user" });
  }
});

module.exports = router;
