const TeachersPay = require("../model/TeachersPay_model");

const AddTeacherPay = async (req, res) => {
  try {
    const { name, pay, status } = req.body;

    const newRecord = await TeachersPay.create({
      name,
      pay,
      status,
    });

    res.status(201).json({
      success: true,
      message: "Teacher pay record added successfully!",
      data: newRecord,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const GetAllTeachersPay = async (req, res) => {
  try {
    const records = await TeachersPay.findAll();

    res.status(200).json({
      success: true,
      data: records,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const GetTeacherPay = async (req, res) => {
  try {
    const { id } = req.params;

    const record = await TeachersPay.findByPk(id);
    if (!record)
      return res
        .status(404)
        .json({ success: false, message: "Record not found" });

    res.status(200).json({ success: true, data: record });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const UpdateTeacherPay = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, pay, status } = req.body;

    const record = await TeachersPay.findByPk(id);
    if (!record)
      return res
        .status(404)
        .json({ success: false, message: "Record not found" });

    await record.update({ name, pay, status });

    res.status(200).json({
      success: true,
      message: "Record updated successfully",
      data: record,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const DeleteTeacherPay = async (req, res) => {
  try {
    const { id } = req.params;

    const record = await TeachersPay.findByPk(id);
    if (!record)
      return res
        .status(404)
        .json({ success: false, message: "Record not found" });

    await record.destroy();

    res
      .status(200)
      .json({ success: true, message: "Record deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports={AddTeacherPay,GetAllTeachersPay,GetTeacherPay,UpdateTeacherPay,DeleteTeacherPay}
