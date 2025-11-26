const DailyExpense = require("../model/daily_expense_mdoel");

// Get all daily expenses
const getAllExpenses = async (req, res) => {
  try {
    const expenses = await DailyExpense.findAll({ order: [["date", "DESC"]] });
    res.status(200).json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch daily expenses." });
  }
};

// Get a single expense by ID
const getExpenseById = async (req, res) => {
  const { id } = req.params;
  try {
    const expense = await DailyExpense.findByPk(id);
    if (!expense) return res.status(404).json({ error: "Expense not found." });
    res.status(200).json(expense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch the expense." });
  }
};

// Create a new expense
const createExpense = async (req, res) => {
  const { expense_by, amount, category, description, date } = req.body;
  try {
    const newExpense = await DailyExpense.create({ expense_by, amount, category, description, date });
    res.status(201).json(newExpense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create the expense." });
  }
};

// Update an expense
const updateExpense = async (req, res) => {
  const { id } = req.params;
  const { expense_by, amount, category, description, date } = req.body;
  try {
    const expense = await DailyExpense.findByPk(id);
    if (!expense) return res.status(404).json({ error: "Expense not found." });

    await expense.update({ expense_by, amount, category, description, date });
    res.status(200).json(expense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update the expense." });
  }
};

// Delete an expense
const deleteExpense = async (req, res) => {
  const { id } = req.params;
  try {
    const expense = await DailyExpense.findByPk(id);
    if (!expense) return res.status(404).json({ error: "Expense not found." });

    await expense.destroy();
    res.status(200).json({ message: "Expense deleted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete the expense." });
  }
};

module.exports = {
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
};
