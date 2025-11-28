const express = require("express");
const router = express.Router();
const teacherController = require("../controllers/Teacher_controller");
const middleware = require("../midlleware/auth_middleware");

router.post("/", middleware, teacherController.AddTeacher);
router.get("/", middleware, teacherController.GetTeachers);
router.put("/:id", middleware, teacherController.UpdateTeacher);
router.delete("/:id", middleware, teacherController.DeleteTeacher);

module.exports = router;
