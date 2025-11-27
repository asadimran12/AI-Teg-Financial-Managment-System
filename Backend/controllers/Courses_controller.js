const Course = require("../model/Course_model");

// Create Course
const Addcourse = async (req, res) => {
  try {
    const { name, duration, fee, description } = req.body;

    const course = await Course.create({
      name,
      duration,
      fee,
      description,
    });

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: "Failed to create course" });
  }
};

// Get All Courses
const GetCourse = async (req, res) => {
  try {
    const courses = await Course.findAll();
    return res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: "Failed to load courses" });
  }
};

// Get Specific Course by ID
const GetSpecificCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findByPk(id);

    if (!course) {
      return res.status(404).json({ success: false, error: "Course not found" });
    }

    return res.status(200).json({ success: true, data: course });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: "Failed to load course" });
  }
};

// Update Course
const UpdateCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).json({ success: false, error: "Course not found" });
    }

    await course.update(req.body);

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: course,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: "Failed to update course" });
  }
};

// Delete Course
const DeleteCoourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).json({ success: false, error: "Course not found" });
    }

    await course.destroy();

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: "Failed to delete course" });
  }
};

module.exports = {
  Addcourse,
  GetCourse,
  GetSpecificCourse,
  UpdateCourse,
  DeleteCoourse,
};
