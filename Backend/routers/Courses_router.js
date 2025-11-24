const express = require("express");
const router = express.Router();
const courseController = require("../controllers/Courses_controller");

router.post("/", courseController.Addcourse); 
router.get("/", courseController.GetCourse); 
router.delete("/:id", courseController.DeleteCoourse); 

module.exports = router;
