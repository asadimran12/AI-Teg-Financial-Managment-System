const express = require("express");
const router = express.Router();
const SalesController = require("../controllers/Sales_controller");
const middleware = require("../midlleware/auth_middleware");

router.post("/", middleware, SalesController.AddSales);
router.put("/:id", middleware, SalesController.UpdateSale);
router.get("/:id", middleware, SalesController.GetSaleById);
router.get("/", middleware, SalesController.GetSale);
router.delete("/:id", middleware, SalesController.DeleteSale);

module.exports = router;
