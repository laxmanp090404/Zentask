const mongoose = require('mongoose');

const columnSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Board',
      required: true
    },
    order: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

const Column = mongoose.model('Column', columnSchema);
module.exports = Column;