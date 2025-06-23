const mongoose = require('mongoose');

const columnSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    boardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
    order: { type: Number }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Column', columnSchema);