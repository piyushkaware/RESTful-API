var express = require("express");
var router = express.Router();
// const { body, validationResult, param } = require("express-validator");
const bcrypt = require("bcrypt");
var bodyParser = require("body-parser");
// const User = require("../model/user");
const Post = require("../model/post");
var jwt = require("jsonwebtoken");
// const { application } = require("express");
const SECRET = "10xacademy";

router.use(bodyParser());

//=======================================GET API FOR POST FROM DATABASE=========================================
router.get("/", async (req, res) => {
  try {
    const post = await Post.find();
    return res.json({
      status: "Success",
      post,
    });
  } catch (e) {
    return res.json({
      status: "Failed",
      message: e.message,
    });
  }
});
// CURD operations are below
//===========================================CREATE POST API ===========================================
router.post("/", async (req, res) => {
  try {
    const post = await Post.create({
      title: req.body.title,
      body: req.body.body,
      image: req.body.image,
      user: req.user,
    });
    // console.log(req.user);
    return res.json({
      status: "success",
      post,
    });
  } catch (e) {
    return res.json({
      status: "Failed",
      message: e.message,
    });
  }
});

//========================================UPDATE POST API=========================================================
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.updateOne(
      { _id: req.params.id, user: req.user },
      { body: req.body.body, title: req.body.title, image: req.body.image }
    );
    // console.log(req.user);
    if (post.matchedCount > 0) {
      return res.json({
        status: "Success",
        message: "Post has been updated",
      });
    } else {
      return res.json({
        status: "Failed",
        message: "Invalid User",
      });
    }
  } catch (e) {
    return res.json({
      status: "Failed",
      message: e.message,
    });
  }
});

//==============================================DELETE POST API========================================================
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.deleteOne({ _id: req.params.id, user: req.user });
    if (post.deletedCount > 0) {
      return res.json({
        status: "Success",
        message: "Post has been deleted",
      });
    } else {
      return res.json({
        status: "Failed",
        message: "Invalid user",
      });
    }
  } catch (e) {
    return res.json({
      status: "Failed",
      message: e.message,
    });
  }
});
module.exports = router;
