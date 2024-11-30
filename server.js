require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const cors = require("cors");

const users = require("./routes/api/users");
const plaid = require("./routes/api/plaid");

const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(compression()); // Response compression
app.use(cors()); // Enable CORS
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 })); // Rate limiting
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB Config
const db = process.env.MONGO_URI;

// Check .env configuration
if (!db) {
  console.error("Error: Missing MONGO_URI in environment variables");
  process.exit(1);
}

// Connect to MongoDB
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDB successfully connected"))
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1);
  });

// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);

// Routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/plaid", require("./routes/api/plaid"));
app.get("/", (req, res) => {
  res.json({ message: "Server is running!" });
});

// General error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "The requested resource was not found.",
  });
});

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server up and running on port ${port}!`));
