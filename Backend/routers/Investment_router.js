const express = require("express");
const router = express.Router();
const investmentController = require("../controllers/Investment_controller");

router.post("/", investmentController.AddInvestment); 
router.get("/", investmentController.GetInvestments); 
router.put("/:id",investmentController.UpdateInvestment)
router.delete("/:id", investmentController.DeleteInvestment); 

module.exports = router;
