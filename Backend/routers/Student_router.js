const express = require("express");
const router = express.Router();
const studentController = require("../controllers/Student_controller");

router.post("/", studentController.AddStudent); 
router.get("/", studentController.GetStudents); 
router.put("/:id",studentController.UpdateStudent)
router.delete("/:id", studentController.DeleteStudent); 

module.exports = router;
