const Teachers = require("../model/Teacher_model");

// Add new teacher
const AddTeacher = async (req, res) => {
  try {
    const { name, email, Phone_number, courses, pay, pay_status } = req.body;

    const newTeacher = await Teachers.create({
      name,
      email,
      Phone_number,
      courses,
      pay,
      pay_status: pay_status || "unpaid",
    });

    res.status(201).json(newTeacher);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error });
  }
};

// Get all teachers
const GetTeachers = async (req, res) => {
  try {
    const teachers = await Teachers.findAll();
    res.status(200).json(teachers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error });
  }
};

// Get single teacher by ID
const GetTeacherById = async (req, res) => {
  try {
    const teacher = await Teachers.findByPk(req.params.id);
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    res.status(200).json(teacher);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error });
  }
};

// Update teacher
const UpdateTeacher = async (req, res) => {
  try {
    const { name, email, Phone_number, courses, pay, pay_status } = req.body;

    const teacher = await Teachers.findByPk(req.params.id);
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    teacher.name = name || teacher.name;
    teacher.email = email || teacher.email;
    teacher.Phone_number = Phone_number || teacher.Phone_number;
    teacher.courses = courses || teacher.courses;
    teacher.pay = pay || teacher.pay;
    teacher.pay_status = pay_status || teacher.pay_status;

    await teacher.save();
    res.status(200).json(teacher);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error });
  }
};

// Delete teacher
const DeleteTeacher = async (req, res) => {
  try {
    const teacher = await Teachers.findByPk(req.params.id);
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    await teacher.destroy();
    res.status(200).json({ message: "Teacher deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error });
  }
};

module.exports = {
  AddTeacher,
  GetTeachers,
  GetTeacherById,
  DeleteTeacher,
  UpdateTeacher,
};
