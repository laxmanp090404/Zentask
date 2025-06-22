const Column = require('../model/columnModel');
const Board = require('../model/boardModel');

// @desc    Create a new column
// @route   POST /api/boards/:boardId/columns
// @access  Private
const createColumn = async (req, res) => {
  try {
    const { title } = req.body;
    const { boardId } = req.params;
    
    // Check if board exists and user owns it
    const board = await Board.findById(boardId);
    
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }
    
    if (board.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    // Find the highest order to place the new column at the end
    const columns = await Column.find({ boardId });
    const order = columns.length > 0 
      ? Math.max(...columns.map(col => col.order)) + 1 
      : 0;
    
    const column = await Column.create({
      title,
      boardId,
      order
    });
    
    res.status(201).json(column);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all columns for a board
// @route   GET /api/boards/:boardId/columns
// @access  Private
const getColumns = async (req, res) => {
  try {
    const { boardId } = req.params;
    
    // Check if board exists and user owns it
    const board = await Board.findById(boardId);
    
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }
    
    if (board.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    const columns = await Column.find({ boardId }).sort({ order: 1 });
    
    res.status(200).json(columns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a column
// @route   PUT /api/columns/:id
// @access  Private
const updateColumn = async (req, res) => {
  try {
    const { title, order } = req.body;
    
    const column = await Column.findById(req.params.id);
    
    if (!column) {
      return res.status(404).json({ message: 'Column not found' });
    }
    
    // Check if user owns the board that contains this column
    const board = await Board.findById(column.boardId);
    
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }
    
    if (board.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    column.title = title || column.title;
    if (order !== undefined) {
      column.order = order;
    }
    
    const updatedColumn = await column.save();
    
    res.status(200).json(updatedColumn);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a column
// @route   DELETE /api/columns/:id
// @access  Private
const deleteColumn = async (req, res) => {
  try {
    const column = await Column.findById(req.params.id);
    
    if (!column) {
      return res.status(404).json({ message: 'Column not found' });
    }
    
    // Check if user owns the board that contains this column
    const board = await Board.findById(column.boardId);
    
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }
    
    if (board.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    await column.deleteOne();
    
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createColumn,
  getColumns,
  updateColumn,
  deleteColumn
};