const express = require('express');
const router = express.Router();
const {
  createBoard,
  getBoards,
  getBoard,
  updateBoard,
  deleteBoard
} = require('../controller/boardController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getBoards)
  .post(protect, createBoard);

router.route('/:id')
  .get(protect, getBoard)
  .put(protect, updateBoard)
  .delete(protect, deleteBoard);

module.exports = router;