const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const db = require("./model");
require("dotenv").config();
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Middleware
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
 
// Routes
const userRoutes = require("./routes/routes");
app.use("/api", userRoutes);

// Sync Database
db.sequelize.sync({ alter: true }).then(() => {
  console.log("✅ Database synced");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
