const express = require("express");
const router = express.Router();
const controller = require("../controllers/Teacherpay_controller");
const middleware=require("../midlleware/auth_middleware")

router.post("/add",middleware, controller.AddTeacherPay);
router.get("/all",middleware, controller.GetAllTeachersPay);
router.get("/:id",middleware, controller.GetTeacherPay);
router.put("/:id",middleware, controller.UpdateTeacherPay);
router.delete("/:id",middleware, controller.DeleteTeacherPay);

module.exports = router;
