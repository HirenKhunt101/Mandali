const express = require("express");
const router = express.Router();
const property = require("../controllers/property");

router.post("/add_property", property.add_property);

module.exports = router;
