const mongo = require("../database/database.service");
const schema = require("../database/database.schema");
const bcrypt = require("bcryptjs");
const SALT_WORK_FACTOR = 10;
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const decrypt = require("./decryption");
const Cryptr = require("cryptr");

const User = schema.User;
const Mandali = schema.Mandali;

const encrypt = (text) => {
  const secrateKey = process.env.DECRYPT;
  const cryptr = new Cryptr(secrateKey);

  const encryptedString = cryptr.encrypt(text);
  return encryptedString;
};

let user_signup = async function (req, res) {
  let body = req.body;
  let alldata = new User(body);
  try {
    let is_user_exist = await User.find({ Email: alldata.Email });
    if (is_user_exist.length === 0) {
      let mandali = new Mandali();
      mandali.MandaliName = body.MandaliName;

      alldata.Password = bcrypt.hashSync(req.body.Password, SALT_WORK_FACTOR);
      alldata.UpdatedAt = Date.now();
      alldata.IsLoginAble = true;
      alldata.UserType = "admin";
      alldata.MandaliId = mandali._id;
      alldata.Username = body.FirstName + " " + body.LastName;

      await Promise.all([
        mongo.insertIntoCollection(alldata),
        mongo.insertIntoCollection(mandali),
      ]);
      return res.status(201).json({
        statusMessage: "User inserted",
        success: true,
        data: {},
      });
    } else {
      return res.status(409).json({
        statusMessage: "User already exist for this email",
        data: {},
        success: false,
      });
    }
  } catch (error) {
    return res.status(501).json({
      statusMessage: "Error in user signup",
      data: error,
      success: false,
    });
  }
};

let user_login = async function (req, res) {
  let body = req.body;
  let data = {};

  try {
    // Add this encrypt in frontend remove from here
    // body.Password = encrypt(body.Password);

    //decrypt Password
    // if (body.Password) {
    //   body.Password = decrypt(body.Password);
    // }
    let Users = [];

    res.clearCookie("Token");
    let is_user_exist = await User.find({
      Email: req.body.Email,
    });

    let statusMessage = "";
    if (is_user_exist.length !== 0) {
      if (is_user_exist[0].IsLoginAble == false) {
        return res.status(402).json({
          statusMessage: "User doesn't have login access",
          data: {},
        });
      }

      let userData = is_user_exist[0];
      if (bcrypt.compareSync(req.body.Password, userData.Password)) {
        userData.Password = "";

        let token = jwt.sign(
          { Email: userData.Email, ClientId: userData._id },
          "mandali"
        );
        res.cookie("Token", token, {
          maxAge: 2700000,
          httpOnly: true,
          sameSite: "none",
          secure: true,
        });

        data.user = {
          Email: userData.Email,
          UserName: userData.Username,
          UserId: userData._id.toString(),
          UserType: userData.UserType,
          MandaliId: userData.MandaliId.toString(),
        };

        res.status(200).json({
          statusMessage: "User verified",
          data: data,
        });
      } else {
        return res
          .status(401)
          .json({ statusMessage: "Incorrect password entered", data: {} });
      }
    } else {
      return res
        .status(403)
        .json({ statusMessage: "User doesn't exist", data: {} });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(501)
      .json({ statusMessage: "Error in user login", data: error });
  }
};

let logout = async function (req, res) {
  try {
    // clear token store in client side cookie
    res.clearCookie("Token");
    res.status(200).json({
      API: "LOGOUT_API",
      statusMessage: "Cookie cleared and user logout successfully",
    });
  } catch (error) {
    console.log(`Error in catch : ${error}`);
    return res.status(501).json({
      API: "LOGOUT_API",
      statusMessage: "Error in logout",
      data: error,
    });
  }
};

let change_password = async function (req, res) {
  let body = req.body;
  let data = {};
  try {
    let user_details = await User.findById(body.UserId);
    // compare old password
    if (bcrypt.compareSync(body.OldPassword, user_details.Password)) {
      user_details.Password = bcrypt.hashSync(
        body.NewPassword,
        SALT_WORK_FACTOR
      );
      user_details.UpdatedAt = Date.now();
      user_details.ResetPassword = {
        Token: null,
        Expires: null,
      };
      // update new password
      await User.updateOne({ _id: body.UserId }, user_details);

      return res
        .status(201)
        .json({ statusMessage: "Password Changed Successfully!", data: {} });
    } else {
      return res
        .status(401)
        .json({ statusMessage: "Please Enter Correct Old Password", data: {} });
    }
  } catch (error) {
    console.log(`Error in catch : ${error}`);
    return res.status(501).json({
      API: "READ_USER_PROFILE_API",
      statusMessage: "Error in change password",
      data: error,
    });
  }
};

module.exports = {
  user_signup: user_signup,
  user_login: user_login,
  logout: logout,
  change_password: change_password,
};
