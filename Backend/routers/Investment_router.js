const express = require("express");
const router = express.Router();
const investmentController = require("../controllers/Investment_controller");
const middleware=require("../midlleware/auth_middleware")

router.post("/",middleware, investmentController.AddInvestment); 
router.get("/",middleware, investmentController.GetInvestments); 
router.put("/:id",middleware,investmentController.UpdateInvestment)
router.delete("/:id",middleware, investmentController.DeleteInvestment); 

module.exports = router;
