const express = require("express");
const app = express();
// Using Node.js `require()`
const mongoose = require("mongoose");
const loginRoute = require("./routes/login");
const postRoute = require("./routes/post");
const userRoute = require("./routes/user");
var jwt = require("jsonwebtoken");
const SECRET = "10xacademy";

mongoose.connect("mongodb://localhost:27017/assignment_5");

app.use("/api/v1/posts", async (req, res, next) => {
  // console.log(req.headers.authorization);
  var token = req.headers.authorization.split("Bearer ")[1];
  // console.log(token);
  if (!token) {
    return res.status(401).json({
      status: "Failed",
      message: "token is empty",
    });
  } else {
    // invalid token
    jwt.verify(token, SECRET, async function (err, decoded) {
      // err
      // decoded undefined
      if (err) {
        return res.status(401).json({
          status: "Failed",
          message: "Invaild token",
        });
      }
      // console.log(decoded);
      req.user = decoded.data;
      next();
    });
  }
});

app.use("/api/v1", loginRoute);
app.use("/api/v1/posts", postRoute);
app.use("/api/v1/user", userRoute);

app.get("*", (req, res) => {
  res.status(404).json({
    status: "Failed",
    message: "Page Not Found",
  });
});

app.listen(3000, () => {
  console.log(`server is listining for assignement 5 ${3000}`);
});
