const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  createTask,
  getTasks
} = require('../controller/taskController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getTasks)
  .post(protect, createTask);

module.exports = router;