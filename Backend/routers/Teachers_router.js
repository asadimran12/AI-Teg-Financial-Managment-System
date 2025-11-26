const express = require("express");
const router = express.Router();
const teacherController = require("../controllers/Teacher_controller");

router.post("/", teacherController.AddTeacher); 
router.get("/", teacherController.GetTeachers); 
router.put("/:id",teacherController.UpdateTeacher)
router.delete("/:id", teacherController.DeleteTeacher); 

module.exports = router;
