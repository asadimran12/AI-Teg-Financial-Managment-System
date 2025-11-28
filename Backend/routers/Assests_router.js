const express = require("express");
const router = express.Router();
const assetController = require("../controllers/Assests_controller");
const middleware=require("../midlleware/auth_middleware")
router.post("/", middleware,assetController.CreateAsset); 
router.get("/",middleware, assetController.GetAllAssets); 
router.put("/:id",middleware,assetController.UpdateAsset)
router.delete("/:id", middleware,assetController.DeleteAsset); 

module.exports = router;
