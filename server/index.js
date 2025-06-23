const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./util/connectDb');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/boards', require('./routes/boardRoutes'));
app.use('/api/boards/:boardId/columns', require('./routes/boardColumnRoutes'));
app.use('/api/columns', require('./routes/columnRoutes'));
app.use('/api/columns/:columnId/tasks', require('./routes/columnTaskRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Task Board API' });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});