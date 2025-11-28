const express = require("express");
const router = express.Router();
const DEController = require("../controllers/daily_expense_controller");
const middleware=require("../midlleware/auth_middleware")

router.post("/",middleware, DEController.createExpense);
router.put("/:id",middleware, DEController.updateExpense);
router.get("/:id",middleware, DEController.getExpenseById);
router.get("/",middleware, DEController.getAllExpenses);
router.delete("/:id",middleware, DEController.deleteExpense);

module.exports = router;
