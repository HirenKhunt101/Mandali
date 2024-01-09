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
const Activity = schema.Activity;
const Installment = schema.Installment;

let add_user = async function (req, res) {
  let body = req.body;
  let data = {};
  try {
    let user = body;
    user.Password = bcrypt.hashSync(user.Password, SALT_WORK_FACTOR);
    user.IsLoginAble = true;
    user.UserType = body.IsAdmin ? "admin" : "member";
    user.Username = body.FirstName + " " + body.LastName;
    user = new User(user);

    let activity_details = new Activity();
    activity_details.UserId = body.AdminId;
    activity_details.ActivityType = "add_member";
    activity_details.Detail = {
      Username: user.Username,
    };

    await Promise.all([user.save(), activity_details.save()]);

    return res.status(201).json({
      statusMessage: " User Profile Created Successfully",
      success: true,
    });
  } catch (error) {
    console.log(`Error in catch : ${error}`);
    return res.status(501).json({
      statusMessage: "Error in add member, Please try again!",
      data: error,
      success: false,
    });
  }
};

let read_user = async function (req, res) {
  let body = req.body;
  let data = {};
  try {
    data.UserDetails = await User.aggregate([
      {
        $match: {
          MandaliId: new mongoose.Types.ObjectId(body.MandaliId),
        },
      },
      {
        $lookup: {
          from: "installments",
          localField: "_id",
          foreignField: "UserId",
          as: "installment_detail",
        },
      },
      {
        $unwind: {
          path: "$installment_detail",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          Username: {
            $first: "$Username",
          },
          ContactNumber: {
            $first: "$ContactNumber",
          },
          Email: {
            $first: "$Email",
          },
          NoOfAccount: {
            $first: "$NoOfAccount",
          },
          TotalInvestment: {
            $sum: { $ifNull: ["$installment_detail.Amount", 0] },
          },
          createdAt: {
            $first: "$createdAt",
          },
        },
      },
      {
        $lookup: {
          from: "penalties",
          localField: "_id",
          foreignField: "UserId",
          as: "penalty_detail",
        },
      },
      {
        $unwind: {
          path: "$penalty_detail",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          Username: {
            $first: "$Username",
          },
          ContactNumber: {
            $first: "$ContactNumber",
          },
          Email: {
            $first: "$Email",
          },
          NoOfAccount: {
            $first: "$NoOfAccount",
          },
          TotalInvestment: {
            $first: "$TotalInvestment",
          },
          TotalPenalty: {
            $sum: { $ifNull: ["$penalty_detail.Amount", 0] },
          },
          createdAt: {
            $first: "$createdAt",
          },
        },
      },
      {
        $sort: {
          createdAt: 1,
        },
      },
    ]);

    data.TotalAccount = data.UserDetails.reduce(
      (acc, cur) => acc + (cur.NoOfAccount ? cur.NoOfAccount : 0),
      0
    );
    return res.status(201).json({
      statusMessage: " User Profile Read successfully",
      success: true,
      data: data,
    });
  } catch (error) {
    console.log(`Error in catch : ${error}`);
    return res.status(501).json({
      statusMessage: "Error in read user",
      data: error,
      success: false,
    });
  }
};

let read_dashboard = async function (req, res) {
  let body = req.body;
  let data = {};
  try {
    let [installment_detail, user_detail] = await Promise.all([
      Installment.aggregate([
        {
          $match: {
            MandaliId: new mongoose.Types.ObjectId(body.MandaliId),
          },
        },
        {
          $group: {
            _id: "$MandaliId",
            Total: {
              $sum: "$Amount",
            },
          },
        },
      ]),
      User.find({ MandaliId: body.MandaliId }),
    ]);

    data.TotalInvestment = installment_detail[0].Total;
    data.TotalMember = user_detail.length;
    return res.status(201).json({
      statusMessage: " Dashboard Read successfully",
      success: true,
      data: data,
    });
  } catch (error) {
    console.log(`Error in catch : ${error}`);
    return res.status(501).json({
      statusMessage: "Error in read dashboard",
      data: error,
      success: false,
    });
  }
};

module.exports = {
  add_user: add_user,
  read_user: read_user,
  read_dashboard: read_dashboard,
};
