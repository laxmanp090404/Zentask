const Task = require('../model/taskModel');
const Column = require('../model/columnModel');
const Board = require('../model/boardModel');

// @desc    Create a new task
// @route   POST /api/columns/:columnId/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, assignedTo } = req.body;
    const { columnId } = req.params;
    
    // Check if column exists
    const column = await Column.findById(columnId);
    
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
    
    // Find the highest order to place the new task at the bottom
    const tasks = await Task.find({ columnId });
    const order = tasks.length > 0 
      ? Math.max(...tasks.map(task => task.order)) + 1 
      : 0;
    
    const task = await Task.create({
      title,
      description,
      columnId,
      priority: priority || 'medium',
      dueDate: dueDate || null,
      createdBy: req.user.id,
      assignedTo: assignedTo || null,
      order
    });
    
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all tasks for a column
// @route   GET /api/columns/:columnId/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const { columnId } = req.params;
    
    // Check if column exists
    const column = await Column.findById(columnId);
    
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
    
    const tasks = await Task.find({ columnId })
      .sort({ order: 1 })
      .populate('assignedTo', 'name email');
    
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      columnId, 
      priority, 
      dueDate, 
      assignedTo, 
      order 
    } = req.body;
    
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Validate column if changing
    if (columnId && columnId !== task.columnId.toString()) {
      const newColumn = await Column.findById(columnId);
      if (!newColumn) {
        return res.status(404).json({ message: 'Column not found' });
      }
    }
    
    // Check if user has access to the board
    const column = await Column.findById(task.columnId);
    if (!column) {
      return res.status(404).json({ message: 'Column not found' });
    }
    
    const board = await Board.findById(column.boardId);
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }
    
    if (board.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    // Update task fields
    task.title = title || task.title;
    task.description = description !== undefined ? description : task.description;
    task.columnId = columnId || task.columnId;
    task.priority = priority || task.priority;
    task.dueDate = dueDate !== undefined ? dueDate : task.dueDate;
    task.assignedTo = assignedTo !== undefined ? assignedTo : task.assignedTo;
    
    if (order !== undefined) {
      task.order = order;
    }
    
    const updatedTask = await task.save();
    
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Check if user has access to the board
    const column = await Column.findById(task.columnId);
    if (!column) {
      return res.status(404).json({ message: 'Column not found' });
    }
    
    const board = await Board.findById(column.boardId);
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }
    
    if (board.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    await task.deleteOne();
    
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask
};