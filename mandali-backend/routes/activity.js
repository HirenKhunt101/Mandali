const express = require("express");
const router = express.Router();
const activity = require("../controllers/activity");

router.post("/read_activity", activity.read_activity);

module.exports = router;
