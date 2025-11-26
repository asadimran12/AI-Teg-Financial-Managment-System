const Investment = require("../model/Investment_model");

// Get all investments
const GetInvestments = async (req, res) => {
  try {
    const investments = await Investment.findAll();
    res.status(200).json(investments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get investment by ID
const GetInvestmentById = async (req, res) => {
  const { id } = req.params;
  try {
    const investment = await Investment.findByPk(id);
    if (!investment) return res.status(404).json({ message: "Investment not found" });
    res.status(200).json(investment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Add new investment
const AddInvestment = async (req, res) => {
  const { Invested_by, date, amount, Category ,Quantity} = req.body;
  try {
    const newInvestment = await Investment.create({
      Invested_by,
      date,
      amount,
      Category,
      Quantity
    });
    res.status(201).json(newInvestment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update investment
const UpdateInvestment = async (req, res) => {
  const { id } = req.params;
  const { Invested_by, date, amount, Category ,Quantity} = req.body;
  try {
    const investment = await Investment.findByPk(id);
    if (!investment) return res.status(404).json({ message: "Investment not found" });

    await investment.update({
      Invested_by,
      date,
      amount,
      Category,
      Quantity
    });

    res.status(200).json(investment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete investment
const DeleteInvestment = async (req, res) => {
  const { id } = req.params;
  try {
    const investment = await Investment.findByPk(id);
    if (!investment) return res.status(404).json({ message: "Investment not found" });

    await investment.destroy();
    res.status(200).json({ message: "Investment deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  GetInvestments,
  GetInvestmentById,
  AddInvestment,
  UpdateInvestment,
  DeleteInvestment,
};
