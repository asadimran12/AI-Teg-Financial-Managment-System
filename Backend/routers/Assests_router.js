const express = require("express");
const router = express.Router();
const assetController = require("../controllers/Assests_controller");

router.post("/", assetController.CreateAsset); 
router.get("/", assetController.GetAllAssets); 
router.put("/:id",assetController.UpdateAsset)
router.delete("/:id", assetController.DeleteAsset); 

module.exports = router;
