const express = require("express");
const router = express.Router();
const controller = require("../controllers/Teacherpay_controller");

router.post("/add", controller.AddTeacherPay);
router.get("/all", controller.GetAllTeachersPay);
router.get("/:id", controller.GetTeacherPay);
router.put("/:id", controller.UpdateTeacherPay);
router.delete("/:id", controller.DeleteTeacherPay);

module.exports = router;
