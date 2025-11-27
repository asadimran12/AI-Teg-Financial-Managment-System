const express = require("express");
const router = express.Router();
const courseController = require("../controllers/Courses_controller");

// CREATE Course
router.post("/", courseController.Addcourse);

// READ All Courses
router.get("/", courseController.GetCourse);

// READ Specific Course
router.get("/:id", courseController.GetSpecificCourse);

// UPDATE Course
router.put("/:id", courseController.UpdateCourse);

// DELETE Course
router.delete("/:id", courseController.DeleteCoourse);

module.exports = router;
