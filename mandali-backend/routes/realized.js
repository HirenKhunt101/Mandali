const express = require("express");
const router = express.Router();
const realized = require("../controllers/realized");

router.post("/read_realized", realized.read_realized);

module.exports = router;
