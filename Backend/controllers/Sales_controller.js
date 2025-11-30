const Sales = require("../model/Sales_model");

// Add a new Sale
const AddSales = async (req, res) => {
  try {
    const {
      item,
      customer_name,
      quantity,
      price,
      discount,
      priceafterdiscount,
    } = req.body;

    const sale = await Sales.create({
      item,
      customer_name,
      quantity,
      price,
      discount,
      priceafterdiscount,
    });

    res.status(201).json(sale);
  } catch (error) {
    console.error("Error adding sale:", error);
    res.status(500).json({ error: "Failed to add sale" });
  }
};

// Get all Sale
const GetSale = async (req, res) => {
  try {
    const sales = await Sales.findAll();
    res.json(sales);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to load sales" });
  }
};

// Get a Sale by ID
const GetSaleById = async (req, res) => {
  try {
    const { id } = req.params;
    const sale = await Sales.findOne({ where: { id } });

    if (!sale) return res.status(404).json({ error: "Sale not found" });

    res.json(sale);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to load sale" });
  }
};
// Update a Sale

const UpdateSale = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      item,
      customer_name,
      quantity,
      price,
      discount,
      priceafterdiscount,
    } = req.body;

    const sale = await Sales.findOne({ where: { id } });

    if (!sale) {
      return res.status(404).json({ error: "Sale not found" });
    }

    await sale.update({
      item: item || sale.item,
      customer_name: customer_name || sale.customer_name,
      quantity: quantity || sale.quantity,
      price: price || sale.price,
      discount: discount || sale.discount,
      priceafterdiscount: priceafterdiscount || sale.priceafterdiscount,
    });

    res.json(sale);
  } catch (error) {
    console.error("Error updating sale:", error);
    res.status(500).json({ error: "Failed to update sale" });
  }
};

// Delete a Sale
const DeleteSale = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Sales.destroy({ where: { id } });

    if (!deleted) return res.status(404).json({ error: "Sale not found" });

    res.json({ message: "Sale deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete sale" });
  }
};

module.exports = {
  AddSales,
  GetSale,
  GetSaleById,
  UpdateSale,
  DeleteSale,
};
