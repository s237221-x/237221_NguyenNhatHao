const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/237221_NguyenNhatHao';
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Employee Schema & Model
const employeeSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  gender: String,
  dateOfBirth: String,
  department: String,
  position: String,
  email: String,
  phone: String,
  hireDate: String,
  status: String
}, { timestamps: true });

const Employee = mongoose.model('Employee', employeeSchema, 'employees');

// API Routes
// 1. GET /api/employees - Lấy danh sách nhân viên (có tìm kiếm & lọc)
app.get('/api/employees', async (req, res) => {
  try {
    const { search, department } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } }
      ];
    }

    if (department) {
      query.department = department;
    }

    const employees = await Employee.find(query);
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 2. GET /api/employees/:id - Lấy chi tiết 1 nhân viên
app.get('/api/employees/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 3. POST /api/employees - Thêm nhân viên mới
app.post('/api/employees', async (req, res) => {
  try {
    const newEmployee = new Employee(req.body);
    const savedEmployee = await newEmployee.save();
    res.status(201).json(savedEmployee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 4. PUT /api/employees/:id - Cập nhật thông tin nhân viên
app.put('/api/employees/:id', async (req, res) => {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedEmployee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 5. DELETE /api/employees/:id - Xóa nhân viên
app.delete('/api/employees/:id', async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: 'Xóa nhân viên thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Root route
app.get('/', (req, res) => {
  res.send('HR Management API đang hoạt động!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
