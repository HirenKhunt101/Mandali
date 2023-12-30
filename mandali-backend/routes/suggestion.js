const express = require("express");
const router = express.Router();
const suggestion = require("../controllers/suggestion");

router.post("/create_analysis", suggestion.create_analysis);
router.post("/read_analysis", suggestion.read_analysis);

module.exports = router;
