const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  createColumn,
  getColumns
} = require('../controller/columnController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getColumns)
  .post(protect, createColumn);

module.exports = router;