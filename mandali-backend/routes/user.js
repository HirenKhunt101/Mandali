const express = require("express");
const router = express.Router();
const user = require("../controllers/user");

router.post("/user_signup", user.user_signup);
router.post("/user_login", user.user_login);
router.get("/logout", user.logout);
router.post("/change_password", user.change_password);

module.exports = router;
