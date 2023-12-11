const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");
const UserModel = mongoose.model("UserModel");
const {JWT_SECRET } = require('../config');


router.post("/signup", (req, res) => {
  const { fullName, email, password, profile_pic } = req.body;
  if (!fullName || !password || !email) {
    return res.status(400).json({ error: "Please add all the fields" });
  }
  UserModel.findOne({ email: email })
    .then((userInDB) => {
      if (userInDB) {
        return res.status(500).json({ error: "User already exists" });
      }
      bcrypt.hash(password, 16).then((hashedPassword) => {
        const user = new UserModel({
          fullName,
          email,
          password: hashedPassword,
          profile_pic,
        });
        user
          .save()
          .then((user) => {
            user.password = undefined;
            return res
              .status(201)
              .json({ message: "User signed up successfully", user: user });
          })
          .catch((err) => {
            console.log(err);
            return res.status(500).json({ error: err });
          });
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: err });
    });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!password || !email) {
    return res.status(400).json({ error: "Please add all the fields" });
  }
  UserModel.findOne({ email: email })
    .then((userInDB) => {
      if (!userInDB) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      bcrypt
        .compare(password, userInDB.password)
        .then((didMatch) => {
          if (didMatch) {
            const jwttoken = jwt.sign({ _id: userInDB._id }, JWT_SECRET);
            
            userInDB.password = undefined;
            return res.status(200).json({ message: "user logged in succesfully", token: jwttoken, userInfo: userInDB });
          }else{
            return res.status(401).json({ error: "Invalid email or password" });
          }
        })
        .catch((err) => {
          console.log(err);
        }); 
    })

    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: err });
    });
});

module.exports = router;
