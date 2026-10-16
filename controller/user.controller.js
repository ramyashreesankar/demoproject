const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userService = require('../services/user.services');
class UserController {
  async signup(req, res) {
    try {
      const { name, email, password, role, phone, department } = req.body;

      if (!name || !email || !password || !role) {
        return res.status(400).json({
          message: 'Name, email, password and role are required'
        });
      }

      if (!['Student', 'Teacher'].includes(role)) {
        return res.status(400).json({
          message: 'Role must be Student or Teacher'
        });
      }

      if (typeof password !== 'string' || password.length < 8) {
        return res.status(400).json({
          message: 'Password must contain at least 8 characters'
        });
      }

      const user = await userService.signup({
        name, email, password, role, phone, department
      });

      return res.status(201).json({
        message: 'Signup successful',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          department: user.department
        }
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({
          message: 'Email already exists'
        });
      }

      return res.status(500).json({
        message: 'Signup failed'
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          message: 'Email and password are required'
        });
      }

      const user = await userService.login(email);

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({
          message: 'Invalid email or password'
        });
      }

      const token = jwt.sign(
        {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      return res.status(200).json({
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Login failed'
      });
    }
  }

  async getStudents(req, res) {
    try {
      const users = await userService.getAllByRole('Student');
      return res.json({ users });
    } catch (error) {
      return res.status(500).json({ message: 'Failed to get students' });
    }
  }

  async getTeachers(req, res) {
    try {
      const users = await userService.getAllByRole('Teacher');
      return res.json({ users });
    } catch (error) {
      return res.status(500).json({ message: 'Failed to get teachers' });
    }
  }

  async getStudentById(req, res) {
    try {
      const user = await userService.getById(req.params.id, 'Student');

      if (!user) {
        return res.status(404).json({ message: 'Student not found' });
      }

      return res.json({ user });
    } catch (error) {
      return res.status(500).json({ message: 'Failed to get student' });
    }
  }

  async getTeacherById(req, res) {
    try {
      const user = await userService.getById(req.params.id, 'Teacher');

      if (!user) {
        return res.status(404).json({ message: 'Teacher not found' });
      }

      return res.json({ user });
    } catch (error) {
      return res.status(500).json({ message: 'Failed to get teacher' });
    }
  }

  async updateProfile(req, res) {
    try {
      const user = await userService.updateProfile(req.user.id, req.body);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.json({
        message: 'Profile updated successfully',
        user
      });
    } catch (error) {
      return res.status(500).json({ message: 'Failed to update profile' });
    }
  }

  async updateStudent(req, res) {
    try {
      const user = await userService.updateStudent(req.params.id, req.body);

      if (!user) {
        return res.status(404).json({ message: 'Student not found' });
      }

      return res.json({
        message: 'Student updated successfully',
        user
      });
    } catch (error) {
      return res.status(500).json({ message: 'Failed to update student' });
    }
  }
}

module.exports = new UserController();