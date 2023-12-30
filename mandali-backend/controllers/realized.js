const mongo = require("../database/database.service");
const schema = require("../database/database.schema");
const mongoose = require("mongoose");

const User = schema.User;
const Mandali = schema.Mandali;
const Installment = schema.Installment;
const PendingInstallment = schema.Pending_installment;
const Stock = schema.Stock;
const Realized = schema.Realized;

let read_realized = async function (req, res) {
  let body = req.body;
  let data = {};
  try {
    let [buy_stock, sell_stock] = await Promise.all([
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
          $project: {
            Symbol: "$Symbol",
            Date: "$Transaction.Date",
            Exchange: "$Exchange",
            MandaliId: "$MandaliId",
            StockName: "$StockName",
            MandaliId: "$MandaliId",
            createdAt: "$createdAt",
            updatedAt: "$updatedAt",
            Amount: "$Transaction.Amount",
            Quantity: "$Transaction.Quantity",
          },
        },
      ]),
      Realized.aggregate([
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
          $project: {
            Symbol: "$Symbol",
            Date: "$Transaction.Date",
            Exchange: "$Exchange",
            MandaliId: "$MandaliId",
            StockName: "$StockName",
            MandaliId: "$MandaliId",
            createdAt: "$createdAt",
            updatedAt: "$updatedAt",
            Amount: "$Transaction.Amount",
            Quantity: "$Transaction.Quantity",
          },
        },
      ]),
    ]);

    // console.log(b);

    data.realized_details = [];
    for (let sell of sell_stock) {
      let item = {
        StockName: sell.StockName,
        Symbol: sell.Symbol,
        Quantity: sell.Quantity,
        // Date: sell.Date.toISOString().split("T")[0],
        Date: sell.Date,
        profitLoss: 0,
      };
      for (let i = 0; i < buy_stock.length; i++) {
        if (sell.Symbol == buy_stock[i].Symbol) {
          if (sell.Quantity <= buy_stock[i].Quantity) {
            let matchQuantity = sell.Quantity;
            item.profitLoss +=
              matchQuantity * (sell.Amount - buy_stock[i].Amount);
            buy_stock[i].Quantity -= matchQuantity;
            sell.Quantity -= matchQuantity;
            break;
          } else {
            let matchQuantity = buy_stock[i].Quantity;
            item.profitLoss +=
              matchQuantity * (sell.Amount - buy_stock[i].Amount);
            buy_stock[i].Quantity -= matchQuantity;
            sell.Quantity -= matchQuantity;
            continue;
          }
        }
      }
      data.realized_details.push(item);
    }

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
  read_realized: read_realized,
};

//Amount  Quantity
// 100       100
// 150       200
// 100       150

// Amount Quantity
// 200    50
// 300    200
// 350    200
