// server.js
const express = require('express');
const sequelize = require('./db'); // Sequelize instance
const courseRoutes = require("./routers/Courses_router");
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());

app.use(cors({
  origin: process.env.REACT_URL, 
  credentials: true,
}));

// Test DB connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to Neon PostgreSQL via Sequelize!');
  } catch (err) {
    console.error('❌ Database connection error:', err);
  }
})();

// Sync models
(async () => {
  try {
    await sequelize.sync({ alter: true }); // updates tables if models change
    console.log('✅ All models synced with database');
  } catch (err) {
    console.error('❌ Error syncing models:', err);
  }
})();

// Routes
app.use("/api/courses", courseRoutes);

// Simple route
app.get('/', (req, res) => {
  res.send('AITeg Backend is running with Sequelize');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
