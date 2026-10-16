const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user.models');

class UserService {
  async signup(data) {
    const password = await bcrypt.hash(data.password, 10);

    return User.create({
      name: data.name,
      email: data.email.trim().toLowerCase(),
      password,
      role: data.role,
      phone: data.phone || '',
      department: data.department || ''
    });
  }

  async login(email) {
    return User.findOne({
      email: email.trim().toLowerCase()
    }).select('+password');
  }

  async getAllByRole(role) {
    return User.find({ role }).select('-password');
  }

  async getById(id, role) {
    if (!mongoose.isValidObjectId(id)) {
      return null;
    }

    return User.findOne({
      _id: id,
      role
    }).select('-password');
  }

  async updateProfile(id, data) {
    return User.findByIdAndUpdate(
      id,
      {
        name: data.name,
        phone: data.phone,
        department: data.department
      },
      { new: true, runValidators: true }
    ).select('-password');
  }

  async updateStudent(id, data) {
    if (!mongoose.isValidObjectId(id)) {
      return null;
    }

    return User.findOneAndUpdate(
      { _id: id, role: 'Student' },
      {
        name: data.name,
        phone: data.phone,
        department: data.department
      },
      { new: true, runValidators: true }
    ).select('-password');
  }
}

module.exports = new UserService();