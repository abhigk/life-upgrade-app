const { pool } = require("../db");

const createHabit = async (req, res) => {
  const {
    user_id,
    habit_name,
    frequency,
    habit_description,
    custom_parameters,
    end_date,
  } = req.body;

  try {
    const query = `
      INSERT INTO habits (user_id, habit_name, frequency, habit_description, custom_parameters, end_date)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [
      user_id,
      habit_name,
      frequency,
      habit_description,
      custom_parameters,
      end_date,
    ];

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating habit:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the habit" });
  }
};

const getHabits = async (req, res) => {
  const { user_id } = req.params;

  try {
    const query = "SELECT * FROM habits WHERE user_id = $1";
    const result = await pool.query(query, [user_id]);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching habits:", error);
    res.status(500).json({ error: "An error occurred while fetching habits" });
  }
};

module.exports = {
  createHabit,
  getHabits,
};
