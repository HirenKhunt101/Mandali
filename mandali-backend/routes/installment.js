const express = require("express");
const router = express.Router();
const installment = require("../controllers/installment");

router.post("/create_installment", installment.create_installment);
router.post("/read_installment", installment.read_installment);
router.post(
  "/approve_delete_pending_request",
  installment.approve_delete_pending_request
);

module.exports = router;
