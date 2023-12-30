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

let create_analysis = async function (req, res) {
  let body = req.body;
  let data = {};
  try {
    let StartDate = new Date();
    body.Date = StartDate;
    let analysis_detail = new Analysis(body);
    await analysis_detail.save();

    return res.status(201).json({
      statusMessage: "Analysis create successfully",
      success: true,
    });
  } catch (error) {
    console.log(`Error in catch : ${error}`);
    return res.status(501).json({
      statusMessage: "Error in Create Analysis",
      data: error,
      success: false,
    });
  }
};

let read_analysis = async function (req, res) {
  let body = req.body;
  let data = {};
  try {
    [data.analysis_detail] = await Promise.all([
      Analysis.aggregate([
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
            Date: "$Date",
            ImageUrl: "$ImageUrl",
            Notes: "$Notes",
            StockName: "$StockName",
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
  create_analysis: create_analysis,
  read_analysis: read_analysis,
};
