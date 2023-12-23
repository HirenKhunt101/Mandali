const mongo = require("../database/database.service");
const schema = require("../database/database.schema");
const mongoose = require("mongoose");

const User = schema.User;
const Mandali = schema.Mandali;
const Installment = schema.Installment;
const PendingInstallment = schema.Pending_installment;
const Stock = schema.Stock;

let buy_stock = async function (req, res) {
  let body = req.body;
  let data = {};
  try {
    body.Date = new Date(body.Date);
    let stock_detail = new Stock(body);
    await stock_detail.save();

    return res.status(201).json({
      statusMessage: "Stock purchase successfully",
      success: true,
    });
  } catch (error) {
    console.log(`Error in catch : ${error}`);
    return res.status(501).json({
      statusMessage: "Error in purchase stock",
      data: error,
      success: false,
    });
  }
};

let read_stock = async function (req, res) {
  let body = req.body;
  let data = {};
  try {
    [data.all_stock_detail] = await Promise.all([
      Stock.aggregate([
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
          $group: {
            _id: "$Symbol",
            Cost: { $sum: { $multiply: ["$Quantity", "$Amount"] } },
            Quantity: { $sum: "$Quantity" },
            Exchange: {
              $first: "$Exchange",
            },
            Symbol: {
              $first: "$Symbol",
            },
            StockName: {
              $first: "$StockName",
            },
            // Date: {
            //   $first: '$Exchange'
            // },
          },
        },
        {
          $project: {
            _id: 0,
            Cost: "$Cost",
            Quantity: "$Quantity",
            Exchange: "$Exchange",
            Symbol: "$Symbol",
            StockName: "$StockName",
            Average: { $divide: ["$Cost", "$Quantity"] },
          },
        },
      ]),
    ]);

    return res.status(201).json({
      statusMessage: "Read stocks successfully",
      success: true,
      data: data,
    });
  } catch (error) {
    console.log(`Error in catch : ${error}`);
    return res.status(501).json({
      statusMessage: "Error in read stocks",
      data: error,
      success: false,
    });
  }
};

module.exports = {
  buy_stock: buy_stock,
  read_stock: read_stock,
};
