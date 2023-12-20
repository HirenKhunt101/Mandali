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
    if (body.UserType == "admin") {
      let installment_detail = new Installment(body);
      await installment_detail.save();
    } else {
      let pending_installment = new PendingInstallment(body);
      await pending_installment.save();
    }

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
    if (body.UserType == "admin") {
      [data.Installment, data.pending_installment] = await Promise.all([
        Installment.aggregate([
          {
            $match: {
              MandaliId: new mongoose.Types.ObjectId(body.MandaliId),
            },
          },
          // {
          //   '$skip': 0
          // }, {
          //   '$limit': 20
          // },
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
        PendingInstallment.aggregate([
          {
            $match: {
              MandaliId: new mongoose.Types.ObjectId(body.MandaliId),
            },
          },
          // {
          //   '$skip': 0
          // }, {
          //   '$limit': 20
          // },
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
      ]);
    } else {
      [data.Installment, data.pending_installment] = await Promise.all([
        Installment.aggregate([
          {
            $match: {
              MandaliId: new mongoose.Types.ObjectId(body.MandaliId),
            },
          },
          // {
          //   '$skip': 0
          // }, {
          //   '$limit': 20
          // },
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
        PendingInstallment.aggregate([
          {
            $match: {
              MandaliId: new mongoose.Types.ObjectId(body.MandaliId),
              UserId: new mongoose.Types.ObjectId(body.UserId),
            },
          },
          // {
          //   '$skip': 0
          // }, {
          //   '$limit': 20
          // },
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
      ]);
    }

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
    if (body.Active) {
      let pending_installment = await PendingInstallment.findById(
        body.PendingInstallmentId
      );

      let InstallmentDetails = {
        Date: pending_installment.Date,
        Amount: pending_installment.Amount,
        UserId: pending_installment.UserId,
        MandaliId: pending_installment.MandaliId,
      };
      InstallmentDetails = new Installment(InstallmentDetails);
      InstallmentDetails.save();
    }

    await PendingInstallment.deleteOne({ _id: body.PendingInstallmentId });

    return res.status(201).json({
      statusMessage: "Approve Delete Pending Installment successfully",
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
