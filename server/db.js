const { Pool } = require("pg");

const pool = new Pool({
  user: "abhi",
  host: "localhost",
  database: "dev_habit_db",
  password: "admin",
  port: 5432,
});

module.exports = { pool };
