const express = require("express");
const router = express.Router();
const DEController = require("../controllers/daily_expense_controller");

router.post("/", DEController.createExpense);
router.put("/:id", DEController.updateExpense);
router.get("/:id", DEController.getExpenseById);
router.get("/", DEController.getAllExpenses);
router.delete("/:id", DEController.deleteExpense);

module.exports = router;
