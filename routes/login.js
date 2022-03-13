var express = require("express");
var router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
var bodyParser = require("body-parser");
const User = require("../model/user");
var jwt = require("jsonwebtoken");
const SECRET = "10xacademy";

router.use(bodyParser());

//=============================================API FOR REGISTERATION A USER============================================
router.post(
  "/register",
  body("name"),
  body("email").isEmail(),
  body("password"),
  async (req, res) => {
    try {
      const error = validationResult(req);
      if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
      } else {
        const { name, email, password } = req.body;
        bcrypt.hash(password, 10, async function (err, hash) {
          // Store hash in your password DB.
          if (err) {
            return res.status(400).json({
              status: "Failed",
              message: "Invalid password",
            });
          } else {
            const user = await User.create({
              name,
              email,
              password: hash,
            });
            return res.status(200).json({
              status: "success",
              user,
            });
          }
        });
      }
    } catch (e) {
      return res.status(500).json({
        status: "Failed",
        message: e.message,
      });
    }
  }
);

//===================================================API FOR LOGIN A USER================================================

router.post(
  "/login",
  body("email").isEmail(),
  body("password"),
  async (req, res) => {
    try {
      const error = validationResult(req);
      if (!error.isEmpty()) {
        return res.status(400).json({
          error: error.array(),
        });
      } else {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        // console.log(user);
        if (!user) {
          return res.json({
            status: "Failed",
            message: "Invalid email",
          });
        } else {
          // Load hash from your password DB.
          bcrypt.compare(password, user.password).then(function (result) {
            // result == true
            if (result) {
              const token = jwt.sign(
                {
                  exp: Math.floor(Date.now() / 1000) + 60 * 60,
                  data: user._id,
                },
                SECRET
              );
              return res.json({
                status: "success",
                token,
              });
            } else {
              return res.status(401).json({
                status: "Failed",
                message: "Invalid password",
              });
            }
          });
        }
      }
    } catch (e) {
      res.json({
        status: "Failed",
        message: e.message,
      });
    }
  }
);

module.exports = router;
