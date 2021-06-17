const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.get("/", async (req, res) => {
  const userList = await User.find().select("-passwordHash");
  if (!userList) {
    return res.status(500).json({ success: false });
  }
  res.status(200).send(userList);
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res
        .status(500)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).send(user);
  } catch (error) {
    res.json(error);
  }
});

router.post("/", async (req, res) => {
  try {
    let user = new User({
      passwordHash: bcrypt.hashSync(req.body.password, 10),
      ...req.body,
    });
    user = await user.save();
    if (!user) {
      return res
        .status(500)
        .json({ success: false, message: "User cannot be created" });
    }
    res.status(200).send(user);
  } catch (error) {
    res.send(error);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndRemove(req.params.id);
    if (user) {
      return res
        .status(200)
        .json({ success: true, message: "Deleted successfully" });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
  } catch (error) {
    res.status(400).json({ success: false, error: error });
  }
});

router.get("/get/count", async (req, res) => {
  const userCount = await User.countDocuments((count) => count);
  if (!userCount) {
    return res.status(500).send("Not found");
  }
  res.status(200).json({
    count: userCount,
  });
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(400).send("User not found");
    }
    if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
      const token = jwt.sign(
        {
          userId: user.id,
          isAdmin: user.isAdmin,
        },
        process.env.SECRET_KEY,
        {
          expiresIn: "1d",
        }
      );
      res.status(200).send({ user: user.email, token: token });
    } else {
      res.status(400).send("Wrong password");
    }
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
