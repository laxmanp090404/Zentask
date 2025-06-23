const express = require('express');
const router = express.Router();
const {
  updateColumn,
  deleteColumn
} = require('../controller/columnController');
const { protect } = require('../middleware/authMiddleware');

router.route('/:id')
  .put(protect, updateColumn)
  .delete(protect, deleteColumn);

module.exports = router;