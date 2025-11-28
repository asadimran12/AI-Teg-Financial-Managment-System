const express = require("express");
const router = express.Router();
const courseController = require("../controllers/Courses_controller");
const middleware=require("../midlleware/auth_middleware")

router.post("/",middleware, courseController.Addcourse);
router.get("/",middleware, courseController.GetCourse);
router.get("/:id", middleware,courseController.GetSpecificCourse);
router.put("/:id",middleware, courseController.UpdateCourse);
router.delete("/:id", middleware,courseController.DeleteCoourse);

module.exports = router;
