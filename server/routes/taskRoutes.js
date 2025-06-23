const express = require('express');
const router = express.Router();
const {
  getTasks,
  createTask,
  moveTask, // Import moveTask
  updateTask,
  deleteTask,
} = require('../controller/taskController');
const { protect } = require('../middleware/authMiddleware');

router.route('/:id')
  .put(protect, updateTask)
  .delete(protect, deleteTask);

router.put('/:id/move', protect, moveTask); // Add this route

module.exports = router;