const express = require("express");
const router = express.Router();
const { Router } = require("express");
const middleware = require("../middleware/middleware");
const property = require("./property");
const user = require("./user");
const admin = require("./admin");
const installment = require("./installment");
const holding = require("./holding");
const realized = require("./realized");
const suggestion = require("./suggestion");

router.use("/user", user);

// router.use(middleware.user_authentication); // apply middleware on subsequence routes

router.use("/admin", admin);
router.use("/property", property);
router.use("/installment", installment);
router.use("/holding", holding);
router.use("/realized", realized);
router.use("/suggestion", suggestion);

module.exports = router;
