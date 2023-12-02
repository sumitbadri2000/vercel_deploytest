const express = require("express");

const userR = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { UserModel } = require("../model/user.module");
userR.post("/register", async (req, res) => {
  const { name, email, gender, password, age, city } = req.body;
  try {
    bcrypt.hash(password, 5, async (err, pass) => {
      if (err) {
        res.send(err.message);
      } else {
        const user = new UserModel({
          name,
          email,
          gender,
          password: pass,
          age,
          city,
        });
        await user.save();
        res.send({ msg: "new user" });
      }
    });
  } catch (error) {
    res.send({ msg: "something is wrong", error: error.message });
  }
});

userR.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.find({ email });
    if (user.length > 0) {
      bcrypt.compare(password, user[0].password, (err, result) => {
        if (result) {
          const token = jwt.sign({ userId: user[0]._id }, "ev4");
          res.send({ msg: "login user", token: token });
        } else {
          res.send({ msg: "wrong users" });
        }
      });
    } else {
      res.send({ msg: "wrong" });
    }
  } catch (error) {
    res.send({ msg: "something is wrong", error: error.message });
  }
});

module.exports = { userR };
