const express = require("express");
const router = express.Router();
const admin = require("../controllers/admin");

router.post("/add_user", admin.add_user);
router.post("/read_user", admin.read_user);
router.post("/read_dashboard", admin.read_dashboard);

module.exports = router;
