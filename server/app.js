const express = require("express");
const bodyParser = require("body-parser");
const habitRoutes = require("./routes/habitRoutes");

const app = express();
const port = 3000;

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  next();
});

app.use(bodyParser.json());

// Use habit routes
app.use("/api/habits", habitRoutes);

app.listen(port, () => {
  console.log(`Habits API listening at http://localhost:${port}`);
});
