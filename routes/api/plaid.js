const express = require("express");
const axios = require("axios");
const router = express.Router();
const passport = require("passport");

// Environment variables
const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;

if (!PLAID_CLIENT_ID || !PLAID_SECRET) {
  console.error("Plaid credentials are missing!");
  process.exit(1); // Exit if credentials are missing
}

// @route POST api/plaid/create-link-token
// @desc Create a link token
// @access Private
router.post(
  "/create-link-token",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const user = req.user;

      // Define request payload
      const payload = {
        client_id: PLAID_CLIENT_ID,
        secret: PLAID_SECRET,
        user: {
          client_user_id: user.id, // Unique user identifier
        },
        client_name: "Your App Name",
        products: ["auth", "transactions"], // Define the products you want
        country_codes: ["US"],
        language: "en",
        webhook: `${req.protocol}://${req.get("host")}/api/plaid/webhook`, // Dynamically generate webhook URL
      };

      // Make the HTTP request to create a link token
      const response = await axios.post(
        "https://sandbox.plaid.com/link/token/create", // Use the appropriate environment
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Return the link token
      res.json(response.data);
    } catch (error) {
      console.error("Error creating link token:", error.response?.data || error.message);
      res.status(500).json({
        success: false,
        error: error.response?.data || "Failed to create link token",
      });
    }
  }
);

// @route GET api/plaid/accounts
// @desc Get the user's linked accounts from Plaid
// @access Private
router.get(
  "/accounts",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const user = req.user;
      if (!user || !user.accessToken) {
        return res.status(400).json({
          success: false,
          error: "User access token not found",
        });
      }

      // Define the request to Plaid's accounts endpoint
      const response = await axios.post(
        "https://sandbox.plaid.com/accounts/get", // Plaid API endpoint
        {
          client_id: PLAID_CLIENT_ID,
          secret: PLAID_SECRET,
          access_token: user.accessToken, // Corrected field name
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Return the accounts data
      res.json(response.data);
    } catch (error) {
      console.error("Error fetching accounts:", error.response?.data || error.message);
      res.status(500).json({
        success: false,
        error: error.response?.data || "Failed to fetch accounts",
      });
    }
  }
);

module.exports = router;
