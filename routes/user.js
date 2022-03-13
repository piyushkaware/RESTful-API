const express = require("express");
const router = express.Router();
const User = require("../model/user");
var bodyParser = require("body-parser");
const { body, param, validationResult } = require("express-validator");

router.use(bodyParser());

// Get route for Fetch data
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json({
      users,
    });
  } catch (e) {
    res.json({
      status: "Failed",
      message: e.message,
    });
  }
});

module.exports = router;
