const mongo = require("../database/database.service");
const schema = require("../database/database.schema");
const mongoose = require("mongoose");

const User = schema.User;
const Mandali = schema.Mandali;
const Installment = schema.Installment;
const PendingInstallment = schema.Pending_installment;
const Stock = schema.Stock;
const Realized = schema.Realized;
const Activity = schema.Activity;

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

    let activity_details = new Activity();
    activity_details.UserId = body.UserId;
    activity_details.ActivityType = "buy_stock";
    activity_details.Detail = {
      ...transaction,
      StockName: body.StockName,
    };

    await Promise.all([
      Stock.updateOne(
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
      ),
      activity_details.save(),
    ]);

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

    for (let sell of sell_stock) {
      for (let i = 0; i < buy_stock.length; i++) {
        if (sell.Symbol == buy_stock[i].Symbol) {
          if (sell.Quantity <= buy_stock[i].Quantity) {
            let matchQuantity = sell.Quantity;
            buy_stock[i].Quantity -= matchQuantity;
            sell.Quantity -= matchQuantity;
            break;
          } else {
            let matchQuantity = buy_stock[i].Quantity;
            buy_stock[i].Quantity -= matchQuantity;
            sell.Quantity -= matchQuantity;
            continue;
          }
        }
      }
    }

    data.all_stock_detail = [];

    const symbolMap = new Map();
    buy_stock.forEach((element) => {
      const { Symbol, Amount, Quantity, StockName, Exchange } = element;

      if (!symbolMap.has(Symbol)) {
        symbolMap.set(Symbol, { sumAmount: 0, sumQuantity: 0, count: 0 });
      }

      symbolMap.get(Symbol).sumAmount += Amount * Quantity;
      symbolMap.get(Symbol).sumQuantity += Quantity;
      symbolMap.get(Symbol).StockName = StockName;
      symbolMap.get(Symbol).Exchange = Exchange;
    });

    symbolMap.forEach((value, key) => {
      if (value.sumQuantity !== 0) {
        const average = value.sumAmount / value.sumQuantity;

        data.all_stock_detail.push({
          Symbol: key,
          Average: average,
          SumAmount: value.sumAmount,
          Quantity: value.sumQuantity,
          StockName: value.StockName,
          Exchange: value.Exchange,
        });
      }
    });

    console.log(data.all_stock_detail);

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
    let activity_details = new Activity();
    activity_details.UserId = body.UserId;
    activity_details.ActivityType = "sell_stock";
    activity_details.Detail = {
      ...transaction,
      StockName: body.StockName,
    };

    await Promise.all([
      Realized.updateOne(
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
      ),
      activity_details.save(),
    ]);

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
