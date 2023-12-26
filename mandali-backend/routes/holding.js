const express = require("express");
const router = express.Router();
const holding = require("../controllers/holding");

router.post("/buy_stock", holding.buy_stock);
router.post("/read_stock", holding.read_stock);
router.post("/sell_stock", holding.sell_stock);

module.exports = router;
