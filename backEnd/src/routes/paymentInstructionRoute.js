const express = require("express");
const {
  get,
  add,
  update,
} = require("../controllers/paymentInstructionController");
const router = express.Router();

router.get("/", get);
router.post("/add", add);
router.patch("/update/:id", update);

module.exports = router;