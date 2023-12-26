const mongo = require("../database/database.service");
const schema = require("../database/database.schema");
const mongoose = require("mongoose");

const User = schema.User;
const Mandali = schema.Mandali;
const Installment = schema.Installment;
const PendingInstallment = schema.Pending_installment;
const Stock = schema.Stock;
const Realized = schema.Realized;

let buy_stock = async function (req, res) {
  let body = req.body;
  let data = {};
  try {
    // let stock_detail = new Stock(body);
    // await stock_detail.save();

    let transaction = {
      Amount: body.Amount,
      Quantity: body.Quantity,
      Date: new Date(body.Date),
    };
    const result = await Stock.updateOne(
      { Symbol: body.Symbol },
      {
        $setOnInsert: {
          Exchange: body.Exchange,
          StockName: body.StockName,
          MandaliId: body.MandaliId,
          Symbol: body.Symbol,
        },
        $push: { Transaction: transaction },
      },
      { upsert: true, new: true }
    );

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
        {
          $unwind: {
            path: "$Transaction",
          },
        },
        {
          $group: {
            _id: "$Symbol",
            Cost: {
              $sum: {
                $multiply: ["$Transaction.Quantity", "$Transaction.Amount"],
              },
            },
            Quantity: { $sum: "$Transaction.Quantity" },
            Exchange: {
              $first: "$Exchange",
            },
            Symbol: {
              $first: "$Symbol",
            },
            StockName: {
              $first: "$StockName",
            },
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

let sell_stock = async function (req, res) {
  let body = req.body;
  let data = {};
  try {
    // let stock_detail = new Realized(body);
    // await stock_detail.save();

    let transaction = {
      Amount: body.SellingPrice,
      Quantity: body.SellingQuantity,
      Date: new Date(),
    };
    const result = await Realized.updateOne(
      { Symbol: body.Symbol },
      {
        $setOnInsert: {
          Exchange: body.Exchange,
          StockName: body.StockName,
          MandaliId: body.MandaliId,
          Symbol: body.Symbol,
        },
        $push: { Transaction: transaction },
      },
      { upsert: true }
    );

    return res.status(201).json({
      statusMessage: "Stock sell successfully",
      success: true,
    });
  } catch (error) {
    console.log(`Error in catch : ${error}`);
    return res.status(501).json({
      statusMessage: "Error in sell stock",
      data: error,
      success: false,
    });
  }
};

module.exports = {
  buy_stock: buy_stock,
  read_stock: read_stock,
  sell_stock: sell_stock,
};
