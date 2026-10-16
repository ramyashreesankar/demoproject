
const express = require('express');
const router = express.Router();

const controller = require('../controller/user.controller');
const auth = require('../middlewares/auth.middleware');
const allowRoles = require('../middlewares/permission.middleware');

// ===============================
// PUBLIC APIs
// ===============================

// Student or Teacher signup
router.post('/signup', (req, res) => controller.signup(req, res));

// Login
router.post('/login', (req, res) => controller.login(req, res));


// ===============================
// STUDENT APIs
// Student and Teacher can access
// ===============================

// Get all students
router.get(
  '/students',
  auth,
  allowRoles('Student', 'Teacher'),
  (req, res) => controller.getStudents(req, res)
);

// Get student by ID
router.get(
  '/students/:id',
  auth,
  allowRoles('Student', 'Teacher'),
  (req, res) => controller.getStudentById(req, res)
);


// ===============================
// TEACHER-ONLY APIs
// ===============================

// Get all teachers
router.get(
  '/teachers',
  auth,
  allowRoles('Teacher'),
  (req, res) => controller.getTeachers(req, res)
);

// Get teacher by ID
router.get(
  '/teachers/:id',
  auth,
  allowRoles('Teacher'),
  (req, res) => controller.getTeacherById(req, res)
);

// Update student by ID
router.patch(
  '/students/:id',
  auth,
  allowRoles('Teacher'),
  (req, res) => controller.updateStudent(req, res)
);


// ===============================
// PROFILE API
// Student and Teacher can update
// their own profile
// ===============================

router.patch(
  '/profile',
  auth,
  allowRoles('Student', 'Teacher'),
  (req, res) => controller.updateProfile(req, res)
);

module.exports = router;
