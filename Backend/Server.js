// server.js
const express = require("express");
const sequelize = require("./db"); // Sequelize instance
const courseRoutes = require("./routers/Courses_router");
const studentrouter = require("./routers/Student_router");
const teacherrouter = require("./routers/Teachers_router");
const investrouter = require("./routers/Investment_router");
const assetrouter = require("./routers/Assests_router");
const DErouter = require("./routers/daily_expense_router");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());

const allowedOrigins = [
  process.env.LOCAL_REACT_URL,
  process.env.PRODUCTION_REACT_URL,
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS: " + origin));
      }
    },
    credentials: true,
  })
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to Neon PostgreSQL via Sequelize!");
  } catch (err) {
    console.error("❌ Database connection error:", err);
  }
})();

// Sync models
(async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("✅ All models synced with database");
  } catch (err) {
    console.error("❌ Error syncing models:", err);
  }
})();

// Routes
app.use("/api/courses", courseRoutes);
app.use("/api/students", studentrouter);
app.use("/api/teachers", teacherrouter);
app.use("/api/investment", investrouter);
app.use("/api/assets", assetrouter);
app.use("/api/daily-expenses", DErouter);

// Simple route
app.get("/", (req, res) => {
  res.send("AITeg Backend is running with Sequelize");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
