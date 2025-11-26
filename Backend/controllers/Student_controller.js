const Student = require("../model/Student_model"); 

// Add a new student
const AddStudent = async (req, res) => {
  try {
    const { name, father_name, Address, Phone_number, fee, course } = req.body;
    let courseArray = [];
    if (course) {
      if (Array.isArray(course)) {
        courseArray = course;
      } else if (typeof course === "string") {
        courseArray = [course];
      }
    }

    const student = await Student.create({
      name,
      father_name,
      Address,
      Phone_number,
      fee,
      course: courseArray, // store as JSON array
    });

    res.status(201).json(student);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create student" });
  }
};

// Get all students
const GetStudents = async (req, res) => {
  try {
    const students = await Student.findAll();
    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to load students" });
  }
};

// Get a student by ID
const GetStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findOne({ where: { id } });

    if (!student) return res.status(404).json({ error: "Student not found" });

    res.json(student);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to load student" });
  }
};

// Update a student
const UpdateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, father_name, fee, Address, Phone_number, course } = req.body;

    const student = await Student.findOne({ where: { id } });
    if (!student) return res.status(404).json({ error: "Student not found" });

    // handle optional courses
    let courseArray = student.course; // keep existing if none sent
    if (course) {
      if (Array.isArray(course)) courseArray = course;
      else if (typeof course === "string") courseArray = [course];
    }

    await student.update({
      name: name || student.name,
      father_name: father_name || student.father_name,
      fee: fee || student.fee,
      Address: Address || student.Address,
      Phone_number: Phone_number || student.Phone_number,
      course: courseArray,
    });

    res.json(student);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update student" });
  }
};

// Delete a student
const DeleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Student.destroy({ where: { id } });

    if (!deleted) return res.status(404).json({ error: "Student not found" });

    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete student" });
  }
};

module.exports = {
  AddStudent,
  GetStudents,
  GetStudentById,
  UpdateStudent,
  DeleteStudent,
};
