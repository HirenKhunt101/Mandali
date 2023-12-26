const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Mandali_Schema = new Schema(
  {
    MandaliName: {
      type: String,
      required: true,
    },
    TaxId: String,
    MandaliDescription: String,
  },
  { timestamps: true }
);
// const Mandali = mongoose.model("Mandali", Mandali_Schema);
// module.exports.Mandali = Mandali;

module.exports.Mandali = mongoose.model("Mandali", Mandali_Schema);

const User_Schema = new Schema(
  {
    Email: String,
    ContactNumber: String,
    Username: String,
    FirstName: String,
    LastName: String,
    Password: String,
    MandaliId: {
      type: "ObjectId",
      ref: "Mandali",
    },
    VerificationOTP: {
      OTP: Number,
      UpdatedAt: Date,
    },
    UserType: {
      type: String,
      enum: ["admin", "member"],
      default: "member",
      required: true,
    },
    IsLoginAble: {
      type: Boolean,
      default: false,
      required: [true, "Is Loginable is required"],
    },
    ResetPassword: {
      Token: String,
      Expires: Date,
    },
    AuthToken: {
      Token: String,
      UpdatedAt: Date,
    },
  },
  { timestamps: true }
);
module.exports.User = mongoose.model("User", User_Schema);

const Installment_Schema = new Schema(
  {
    Date: Date,
    UserId: {
      type: "ObjectId",
      ref: "User",
    },
    Amount: Number,
    MandaliId: {
      type: "ObjectId",
      ref: "Mandali",
    },
  },
  { timestamps: true }
);
module.exports.Installment = mongoose.model("Installment", Installment_Schema);

const Pending_installment_Schema = new Schema(
  {
    Date: Date,
    UserId: {
      type: "ObjectId",
      ref: "User",
    },
    Amount: Number,
    MandaliId: {
      type: "ObjectId",
      ref: "Mandali",
    },
  },
  { timestamps: true }
);
module.exports.Pending_installment = mongoose.model(
  "Pending_installment",
  Pending_installment_Schema
);

const Penalty_Schema = new Schema(
  {
    Date: Date,
    UserId: {
      type: "ObjectId",
      ref: "User",
    },
    Amount: Number,
  },
  { timestamps: true }
);
module.exports.Penalty = mongoose.model("Penalty", Penalty_Schema);

const Stock_Schema = new Schema(
  {
    Transaction: [
      {
        type: Object,
      },
    ],
    Date: Date,
    Exchange: String,
    Symbol: String,
    StockName: String,
    MandaliId: {
      type: "ObjectId",
      ref: "Mandali",
    },
  },
  { timestamps: true }
);
module.exports.Stock = mongoose.model("Stock", Stock_Schema);

const Transaction_Schema = new Schema(
  {
    StockId: {
      type: "ObjectId",
      ref: "Stock",
    },
    Quantity: Number,
    Amount: Number,
  },
  { timestamps: true }
);
module.exports.Transaction = mongoose.model("Transaction", Transaction_Schema);

const Realized_Schema = new Schema(
  {
    Transaction: [
      {
        type: Object,
      },
    ],
    Date: Date,
    Symbol: String,
    StockName: String,
    MandaliId: {
      type: "ObjectId",
      ref: "Mandali",
    },
  },
  { timestamps: true }
);
module.exports.Realized = mongoose.model("Realized", Realized_Schema);

const History_Schema = new Schema(
  {
    Message: String,
    UserId: {
      type: "ObjectId",
      ref: "User",
    },
  },
  { timestamps: true }
);
module.exports.History = mongoose.model("History", History_Schema);
