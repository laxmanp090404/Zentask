const express = require('express');
const router = express.Router();
const {
  updateTask,
  deleteTask
} = require('../controller/taskController');
const { protect } = require('../middleware/authMiddleware');

router.route('/:id')
  .put(protect, updateTask)
  .delete(protect, deleteTask);

module.exports = router;