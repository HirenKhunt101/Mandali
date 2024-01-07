const mongo = require("../database/database.service");
const schema = require("../database/database.schema");
const bcrypt = require("bcryptjs");
const SALT_WORK_FACTOR = 10;
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const User = schema.User;
const Mandali = schema.Mandali;
const Installment = schema.Installment;
const PendingInstallment = schema.Pending_installment;
const Penalty = schema.Penalty;
const Activity = schema.Activity;

let create_installment = async function (req, res) {
  let body = req.body;
  let data = {};
  try {
    let StartDate = new Date();
    StartDate.setUTCHours(0, 0, 0, 0);
    StartDate.setDate(1);
    StartDate.setMonth(Number(body.Month - 1));
    StartDate.setFullYear(Number(body.Year));
    body.Date = StartDate;

    let activity_details = new Activity();
    activity_details.UserId = body.UserId;
    activity_details.Detail = {
      Month: body.Month,
      Year: body.Year,
      Amount: body.Amount,
    };

    if (body.UserType == "admin") {
      if (body.Penalty) {
        activity_details.ActivityType = "create_penalty";
        let penalty_detail = new Penalty(body);
        await penalty_detail.save();
      } else {
        activity_details.ActivityType = "create_installment";
        let installment_detail = new Installment(body);
        await installment_detail.save();
      }
    } else {
      activity_details.ActivityType = body.Penalty
        ? "create_pending_penalty"
        : "create_pending_installment";
      let pending_installment = new PendingInstallment(body);
      await pending_installment.save();
    }

    activity_details.save();

    return res.status(201).json({
      statusMessage: "Installment create successfully",
      success: true,
    });
  } catch (error) {
    console.log(`Error in catch : ${error}`);
    return res.status(501).json({
      statusMessage: "Error in Create Installment",
      data: error,
      success: false,
    });
  }
};

let read_installment = async function (req, res) {
  let body = req.body;
  let data = {};
  try {
    let matchObj = {
      MandaliId: new mongoose.Types.ObjectId(body.MandaliId),
    };
    if (body.UserType == "member") {
      matchObj.UserId = new mongoose.Types.ObjectId(body.UserId);
    }
    let [Installment_data, pending_data, penalty_data] = await Promise.all([
      Installment.aggregate([
        {
          $match: {
            MandaliId: new mongoose.Types.ObjectId(body.MandaliId),
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "UserId",
            foreignField: "_id",
            as: "user_details",
          },
        },
        {
          $unwind: {
            path: "$user_details",
          },
        },
        {
          $project: {
            Member_Name: "$user_details.Username",
            Amount: "$Amount",
            Date: {
              $dateToString: {
                format: "%m-%Y",
                date: "$Date",
              },
            },
            Type: "Installment",
            createdAt: "$createdAt",
          },
        },
      ]),
      PendingInstallment.aggregate([
        {
          $match: matchObj,
        },
        {
          $lookup: {
            from: "users",
            localField: "UserId",
            foreignField: "_id",
            as: "user_details",
          },
        },
        {
          $unwind: {
            path: "$user_details",
          },
        },
        {
          $project: {
            Member_Name: "$user_details.Username",
            Amount: "$Amount",
            Date: {
              $dateToString: {
                format: "%m-%Y",
                date: "$Date",
              },
            },
          },
        },
      ]),
      Penalty.aggregate([
        {
          $match: {
            MandaliId: new mongoose.Types.ObjectId(body.MandaliId),
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "UserId",
            foreignField: "_id",
            as: "user_details",
          },
        },
        {
          $unwind: {
            path: "$user_details",
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
        {
          $project: {
            Member_Name: "$user_details.Username",
            Amount: "$Amount",
            Date: {
              $dateToString: {
                format: "%m-%Y",
                date: "$Date",
              },
            },
            Type: "Penalty",
            createdAt: "$createdAt",
          },
        },
      ]),
    ]);

    data.Installment = [...Installment_data, ...penalty_data];
    data.Installment.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    data.pending_installment = pending_data;

    return res.status(201).json({
      statusMessage: "Read Installment successfully",
      success: true,
      data: data,
    });
  } catch (error) {
    console.log(`Error in catch : ${error}`);
    return res.status(501).json({
      statusMessage: "Error in Installment Created",
      data: error,
      success: false,
    });
  }
};

let approve_delete_pending_request = async function (req, res) {
  let body = req.body;
  let data = {};
  try {
    let activity_details = new Activity();
    activity_details.UserId = body.UserId;
    activity_details.ActivityType = body.Active
      ? "approve_pending_request"
      : "delete_pending_request";

    if (body.Active) {
      let pending_installment = await PendingInstallment.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(body.PendingInstallmentId),
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "UserId",
            foreignField: "_id",
            as: "user_details",
          },
        },
        {
          $unwind: {
            path: "$user_details",
          },
        },
        {
          $project: {
            Date: "$Date",
            Amount: "$Amount",
            UserId: "$UserId",
            MandaliId: "$MandaliId",
            Penalty: "$Penalty",
            Username: "$user_details.Username",
          },
        },
      ]);
      pending_installment = pending_installment[0];
      activity_details.Detail = {
        Username: pending_installment.Username,
        Date: pending_installment.Date,
      };
      let InstallmentDetails = {
        Date: pending_installment.Date,
        Amount: pending_installment.Amount,
        UserId: pending_installment.UserId,
        MandaliId: pending_installment.MandaliId,
      };

      if (pending_installment.Penalty) {
        activity_details.Detail.transactionType = "Penalty";
        let penalty_detail = new Installment(InstallmentDetails);
        await penalty_detail.save();
      } else {
        activity_details.Detail.transactionType = "Installment";
        InstallmentDetails = new Installment(InstallmentDetails);
        await InstallmentDetails.save();
      }
    }

    await Promise.all([
      PendingInstallment.deleteOne({ _id: body.PendingInstallmentId }),
      activity_details.save(),
    ]);

    return res.status(201).json({
      statusMessage: body.Active
        ? "Approve transaction successfully"
        : "Delete transaction successfully",
      success: true,
      data: data,
    });
  } catch (error) {
    console.log(`Error in catch : ${error}`);
    return res.status(501).json({
      statusMessage: "Error in Approve Delete Pending Installment",
      data: error,
      success: false,
    });
  }
};

module.exports = {
  create_installment: create_installment,
  read_installment: read_installment,
  approve_delete_pending_request: approve_delete_pending_request,
};
