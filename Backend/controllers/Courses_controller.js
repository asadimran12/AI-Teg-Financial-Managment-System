const Course = require("../model/Course_model");

const Addcourse = async (req, res) => {
  try {
    const { name, duration, fee, description } = req.body;
    const course = await Course.create({
      name,
      duration,
      fee,
      description,
    });
    res.status(201).json(course);
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: "Failed to create course" });
  }
};
const DeleteCoourse = async (req, res) => {
  try {
    const { id } = req.params;
    await Course.destroy({ where: id });
    return res.json({ message: "Course deleted successfully" });
  } catch (error) {
        console.log(error)
    return res.status(500).json({ error: "Failed to load course" });
  }
};

const GetCourse = async (req, res) => {
  try {
    const courses = await Course.findAll();
    return res.status(201).json(courses);
  } catch (error) {
        console.log(error)
    return res.status(500).json({ error: "Failed to load course" });
  }
};
module.exports = { Addcourse, DeleteCoourse, GetCourse };
