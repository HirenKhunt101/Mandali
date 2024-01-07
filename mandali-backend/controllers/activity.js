const mongo = require("../database/database.service");
const schema = require("../database/database.schema");
const mongoose = require("mongoose");

const User = schema.User;
const Mandali = schema.Mandali;
const Installment = schema.Installment;
const PendingInstallment = schema.Pending_installment;
const Stock = schema.Stock;
const Realized = schema.Realized;
const Analysis = schema.Analysis;
const Activity = schema.Activity;

let read_activity = async function (req, res) {
  let body = req.body;
  let data = {};
  try {
    [data.activity_detail] = await Promise.all([
      User.aggregate([
        {
          $match: {
            MandaliId: new mongoose.Types.ObjectId(body.MandaliId),
          },
        },
        {
          $lookup: {
            from: "activities",
            localField: "_id",
            foreignField: "UserId",
            as: "activity_detail",
          },
        },
        {
          $unwind: {
            path: "$activity_detail",
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $project: {
            Username: "$Username",
            Detail: "$activity_detail.Detail",
            ActivityType: "$activity_detail.ActivityType",
            createdAt: "$activity_detail.createdAt",
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
      ]),
    ]);

    return res.status(201).json({
      statusMessage: "Read Analysis successfully",
      success: true,
      data: data,
    });
  } catch (error) {
    console.log(`Error in catch : ${error}`);
    return res.status(501).json({
      statusMessage: "Error in Read Analysis",
      data: error,
      success: false,
    });
  }
};

module.exports = {
  read_activity: read_activity,
};
