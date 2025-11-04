const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const bookingsRouter = require('./routes/bookings');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/bookings', bookingsRouter);

// Health check endpoint
app.get('/api/health', async (req, res) => {
  const mongoose = require('mongoose');
  res.json({
    status: 'OK',
    backend: 'Connected',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});