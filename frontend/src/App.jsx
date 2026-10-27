import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/employees';

function App() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [formData, setFormData] = useState({
    employeeId: '',
    fullName: '',
    gender: 'Nam',
    dateOfBirth: '',
    department: 'Kỹ thuật',
    position: '',
    email: '',
    phone: '',
    hireDate: '',
    status: 'Đang làm việc'
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, [search, department]);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${API_URL}?search=${search}&department=${department}`);
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, formData);
      } else {
        await axios.post(API_URL, formData);
      }
      resetForm();
      fetchEmployees();
    } catch (err) {
      alert('Lỗi khi lưu dữ liệu!');
    }
  };

  const handleEdit = (emp) => {
    setEditingId(emp._id);
    setFormData(emp);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchEmployees();
      } catch (err) {
        alert('Lỗi khi xóa nhân viên!');
      }
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      employeeId: '',
      fullName: '',
      gender: 'Nam',
      dateOfBirth: '',
      department: 'Kỹ thuật',
      position: '',
      email: '',
      phone: '',
      hireDate: '',
      status: 'Đang làm việc'
    });
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center text-primary mb-4">HỆ THỐNG QUẢN LÝ NHÂN SỰ (237221)</h2>
      
      {/* Bộ lọc và Tìm kiếm */}
      <div className="row mb-3">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Tìm kiếm theo Mã NV hoặc Họ Tên..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select className="form-select" value={department} onChange={(e) => setDepartment(e.target.value)}>
            <option value="">-- Tất cả phòng ban --</option>
            <option value="Kỹ thuật">Kỹ thuật</option>
            <option value="Nhân sự">Nhân sự</option>
            <option value="Kinh doanh">Kinh doanh</option>
          </select>
        </div>
      </div>

      {/* Form Nhập liệu */}
      <div className="card mb-4">
        <div className="card-header bg-secondary text-white">
          {editingId ? 'Cập Nhật Nhân Viên' : 'Thêm Nhân Viên Mới'}
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-3">
                <input type="text" className="form-control" placeholder="Mã NV" required
                  value={formData.employeeId} onChange={(e) => setFormData({...formData, employeeId: e.target.value})} />
              </div>
              <div className="col-md-3">
                <input type="text" className="form-control" placeholder="Họ và tên" required
                  value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
              </div>
              <div className="col-md-3">
                <select className="form-select" value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})}>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </div>
              <div className="col-md-3">
                <input type="date" className="form-control" value={formData.dateOfBirth} onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})} />
              </div>
              <div className="col-md-3">
                <input type="text" className="form-control" placeholder="Chức vụ" value={formData.position} onChange={(e) => setFormData({...formData, position: e.target.value})} />
              </div>
              <div className="col-md-3">
                <input type="email" className="form-control" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="col-md-3">
                <input type="text" className="form-control" placeholder="Số điện thoại" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div className="col-md-3">
                <button type="submit" className={`btn ${editingId ? 'btn-warning' : 'btn-success'} w-100`}>
                  {editingId ? 'Cập Nhật' : 'Thêm Mới'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Bảng Nhân viên */}
      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>Mã NV</th>
            <th>Họ Tên</th>
            <th>Giới Tính</th>
            <th>Phòng Ban</th>
            <th>Chức Vụ</th>
            <th>Email</th>
            <th>Thao Tác</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp._id}>
              <td>{emp.employeeId}</td>
              <td>{emp.fullName}</td>
              <td>{emp.gender}</td>
              <td>{emp.department}</td>
              <td>{emp.position}</td>
              <td>{emp.email}</td>
              <td>
                <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(emp)}>Sửa</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(emp._id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
