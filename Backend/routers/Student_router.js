const express = require("express");
const router = express.Router();
const studentController = require("../controllers/Student_controller");
const middleware=require("../midlleware/auth_middleware")

router.post("/",middleware, studentController.AddStudent); 
router.get("/",middleware, studentController.GetStudents); 
router.put("/:id",middleware,studentController.UpdateStudent)
router.delete("/:id",middleware, studentController.DeleteStudent); 

module.exports = router;
