const express = require("express");

const postR = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { PostModel } = require("../model/post.model");

postR.get("/", async (req, res) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, "ev4", async (err, decoded) => {
      if (decoded) {
        const { userId } = decoded;
        const { device, device1, device2 } = req.query;
        let post = await PostModel.find({ user: userId });
        if (device1 && device2) {
          post = await PostModel.find({
            $or: [{ device: `${device1}` }, { device: `${device2}` }],
          });
          res.send(post);
        } else if (device) {
          posts = await PostModel.find({
            device: { $regex: `${device}`, $option: "i" },
          });
          res.send(posts);
        } else {
          res.send(post);
        }
      }
    });
  }
});


postR.post("/create", async (req, res) => {
  const payload = req.body;
  try {
    const post = new PostModel(payload);
    await post.save();
    res.send({ msg: "create post" });
  } catch (error) {
    res.send({ msg: "wrong", error: error.message });
  }
});

postR.patch("/update/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    const payload = req.body;
    await PostModel.findByIdAndUpdate({ _id: postId }, payload);
    res.send({ msg: "updated post" });
  } catch (error) {
    res.send({ msg: "somwthing wrong", error: error.message });
  }
});

postR.delete("/delete/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    await PostModel.findByIdAndDelete({ _id: postId });
    res.send({ msg: "deleted post" });
  } catch (error) {
    res.send({ msg: "somwthing wrong", error: error.message });
  }
});

module.exports = { postR };
