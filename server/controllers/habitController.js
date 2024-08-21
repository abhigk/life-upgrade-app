const { pool } = require("../db");

const createHabit = async (req, res) => {
  const {
    user_id,
    habit_name,
    time_range,
    habit_description,
    custom_parameters,
    end_date,
    icon,
    color,
    selected_days,
    frequency,
  } = req.body;

  console.log("req.body", req.body);

  if (!user_id || !habit_name || !time_range || !frequency || !selected_days) {
    return res.status(400).json({
      error: "Missing required parameters. Please check your request body.",
    });
  }

  try {
    const query = `
      INSERT INTO habits (user_id, habit_name, time_range, habit_description, custom_parameters, end_date,  icon, color, selected_days,frequency)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;
    const values = [
      user_id,
      habit_name,
      time_range,
      habit_description,
      custom_parameters,
      end_date,
      icon,
      color,
      selected_days,
      frequency,
    ];

    const result = await pool.query(query, values);
    if (!result.rows.length) {
      return res.status(500).json({
        error:
          "An error occurred while creating the habit. Please try again later.",
      });
    }

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating habit:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the habit" });
  }
};

const getTodaysHabits = async (req, res) => {
  const { user_id } = req.params;
  const today = new Date(); // get current date
  const query = `
    SELECT * FROM habits
    WHERE user_id = $1
    AND (
      (frequency = 'daily' AND end_date >= $2)
      OR (frequency = 'weekly' AND EXTRACT(dow FROM $2) = EXTRACT(dow FROM start_date))
      OR (frequency = 'monthly' AND EXTRACT(day FROM $2) = EXTRACT(day FROM start_date))
    )
  `;

  try {
    const result = await pool.query(query, [user_id, today]);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching today's habits:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching today's habits" });
  }
};

const getHabitsByDate = async (req, res) => {
  const { user_id, date } = req.params; // Expect date in 'YYYY-MM-DD' format
  console.log("user_id, date", user_id, date);

  if (!date) {
    return res.status(400).json({ error: "Date parameter is required" });
  }

  const queryDate = new Date(date);
  const dayOfWeek = queryDate.getDay(); // 0-6, where 0 is Sunday

  const query = `
    SELECT DISTINCT
      h.habit_id, h.user_id, h.habit_name, h.frequency, h.habit_description, 
      h.custom_parameters, h.created_at, h.end_date, h.selected_days, h.icon, h.color,
      COALESCE(hl.is_completed, false) as is_completed
    FROM habits h
    LEFT JOIN habitLogs hl ON h.habit_id = hl.habit_id AND hl.log_date = $2
    WHERE h.user_id = $1
    AND (
      (frequency = 'daily' AND (h.end_date IS NULL OR h.end_date >= $2))
      OR (h.frequency = 'weekly' AND EXTRACT(dow FROM $2) = EXTRACT(dow FROM h.created_at))
      OR (h.frequency = 'monthly' AND EXTRACT(day FROM $2) = EXTRACT(day FROM h.created_at))
    )
    ORDER BY h.created_at ASC
  `;

  try {
    const result = await pool.query(query, [user_id, queryDate]);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching habits by date:", error);
    res.status(500).json({
      error: "An error occurred while fetching habits for the specified date",
    });
  }
};

const logHabit = async (req, res) => {
  const { habit_id, user_id, log_date, is_completed } = req.body;

  if (
    !habit_id ||
    !user_id ||
    !log_date ||
    typeof is_completed === "undefined"
  ) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  try {
    // Check if a log already exists for the same habit ID and user ID on the same date
    const existingLogQuery = `
      SELECT * FROM habitLogs
      WHERE habit_id = $1 AND user_id = $2 AND log_date = $3
    `;
    const existingLogResult = await pool.query(existingLogQuery, [
      habit_id,
      user_id,
      log_date,
    ]);

    if (
      existingLogResult.rows.length > 0 &&
      existingLogResult.rows.find((row) => row.is_completed === true)
    ) {
      return res
        .status(400)
        .json({ error: "A log already exists for this habit on this date" });
    }

    // If no existing log is found, create a new log
    const query = `INSERT INTO habitLogs (habit_id, user_id, log_date, is_completed)
    VALUES ($1, $2, $3, $4)
    RETURNING habit_id, user_id, log_date::date AS log_date, is_completed
    `;
    const values = [habit_id, user_id, log_date, is_completed];
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error logging habit:", error);
    res.status(500).json({ error: "Error occurred in logging the habit" });
  }
};

const removeHabitLog = async (req, res) => {
  const { habitLogId, userId } = req.params;

  try {
    const result = await db.query(
      `
      DELETE FROM habitLogs
      WHERE id = $1 AND user_id = $2
      RETURNING *
    `,
      [habitLogId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Habit log not found" });
    }

    return res.status(200).json({ message: "Habit log removed successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to remove habit log" });
  }
};

const getAllHabits = async (req, res) => {
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

const editHabit = async (req, res) => {
  const { habit_id } = req.params;
  const {
    habit_name,
    frequency,
    habit_description,
    custom_parameters,
    end_date,
    selected_days,
    icon,
    color,
    time_range,
  } = req.body;

  if (!habit_id) {
    return res.status(400).json({ error: "Habit ID is required" });
  }

  try {
    const query = `
      UPDATE habits
      SET 
        habit_name = COALESCE($1, habit_name),
        frequency = COALESCE($2, frequency),
        habit_description = COALESCE($3, habit_description),
        custom_parameters = COALESCE($4, custom_parameters),
        end_date = COALESCE($5, end_date),
        selected_days = COALESCE($6, selected_days),
        icon = COALESCE($7, icon),
        color = COALESCE($8, color),
         time_range = COALESCE($9, time_range),
        updated_at = CURRENT_TIMESTAMP
      WHERE habit_id = $10
      RETURNING *
    `;

    const values = [
      habit_name,
      frequency,
      habit_description,
      custom_parameters,
      end_date,
      selected_days,
      icon,
      color,
      time_range,
      habit_id,
    ];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Habit not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating habit:", error);
    return res.status(500).json({
      error: "An error occurred while updating the habit",
    });
  }
};

const deleteHabit = async (req, res) => {
  const { habit_id } = req.params;

  try {
    // First, delete associated logs
    await pool.query("DELETE FROM habitLogs WHERE habit_id = $1", [habit_id]);

    // Then, delete the habit
    const result = await pool.query(
      "DELETE FROM habits WHERE habit_id = $1 RETURNING *",
      [habit_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Habit not found" });
    }

    res.json({
      message: "Habit successfully deleted",
      deletedHabit: result.rows[0],
    });
  } catch (error) {
    console.error("Error deleting habit:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the habit" });
  }
};

const getHabitsByWeek = async (req, res) => {
  const { user_id, date } = req.params;

  if (!date) {
    return res.status(400).json({ error: "Date parameter is required" });
  }

  const queryDate = new Date(date);
  if (isNaN(queryDate.getTime())) {
    return res
      .status(400)
      .json({ error: "Invalid date format. Please use YYYY-MM-DD" });
  }

  const startOfWeek = new Date(queryDate);
  startOfWeek.setDate(queryDate.getDate() - queryDate.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  const query = `
    SELECT 
      h.habit_id, h.user_id, h.habit_name, h.frequency, h.habit_description, 
      h.custom_parameters, h.created_at, h.end_date, h.selected_days, h.icon, h.color,
      ARRAY_AGG(DISTINCT hl.log_date ORDER BY hl.log_date) AS completed_dates
    FROM habits h
    LEFT JOIN habitLogs hl ON h.habit_id = hl.habit_id 
      AND hl.log_date BETWEEN $2 AND $3 
      AND hl.is_completed = true
    WHERE h.user_id = $1
    AND (
      (h.frequency = 'daily' AND h.end_date >= $2)
      OR (h.frequency = 'weekly')
      OR (h.frequency = 'monthly' AND 
          (EXTRACT(DAY FROM h.created_at) BETWEEN EXTRACT(DAY FROM $2) AND EXTRACT(DAY FROM $3)
           OR EXTRACT(DAY FROM h.created_at) = EXTRACT(DAY FROM $2)))
    )
    GROUP BY h.habit_id
    ORDER BY h.created_at ASC
  `;

  try {
    const result = await pool.query(query, [user_id, startOfWeek, endOfWeek]);

    const processedResults = result.rows.map((habit) => {
      if (!habit || !habit.completed_dates) {
        throw new Error("Missing data for habit");
      }
      const weekDays = [];
      for (let i = 0; i < 7; i++) {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        const dayStr = day.toISOString().split("T")[0];
        weekDays.push({
          date: dayStr,
          completed: habit.completed_dates.includes(dayStr),
        });
      }
      return { ...habit, week_days: weekDays };
    });

    res.json(processedResults);
  } catch (error) {
    console.error("Error fetching habits by week:", error);
    res.status(500).json({
      error: "An error occurred while fetching habits for the specified week",
    });
  }
};

const optimizeHabitLogs = (habitLogs) => {
  console.log("habitLogs", habitLogs);

  const optimizedLogs = {};

  habitLogs.forEach((log) => {
    const logDate = log.logDate;
    if (!optimizedLogs[logDate]) {
      optimizedLogs[logDate] = [];
    }
    optimizedLogs[logDate].push(log);
  });

  return optimizedLogs;
};

const getAllHabitsWithLogs = async (req, res) => {
  const { user_id } = req.params;

  try {
    const query = `
      SELECT
        h.habit_id,
        h.user_id,
        h.habit_name,
        h.frequency,
        h.habit_description,
        h.custom_parameters,
        h.created_at,
        h.end_date,
        h.selected_days,
        h.icon,
        h.color,
        COALESCE(hl.log_id, NULL) AS log_id,
        COALESCE(hl.log_date, NULL) AS log_date,
        COALESCE(hl.is_completed, NULL) AS is_completed
      FROM habits h
      LEFT JOIN habitLogs hl ON h.habit_id = hl.habit_id
      WHERE h.user_id = $1
      ORDER BY h.created_at ASC, hl.log_date ASC
    `;
    const result = await pool.query(query, [user_id]);

    const habits = result.rows.reduce((acc, row) => {
      const { habit_id } = row;
      if (!acc[habit_id]) {
        acc[habit_id] = {
          habit_id,
          user_id: row.user_id,
          habit_name: row.habit_name,
          frequency: row.frequency,
          habit_description: row.habit_description,
          custom_parameters: row.custom_parameters,
          created_at: row.created_at,
          end_date: row.end_date,
          selected_days: row.selected_days,
          icon: row.icon,
          color: row.color,
          habitLogs: {
            [row.log_date.toISOString()]: {
              log_id: row.log_id,
              log_date: row.log_date,
              is_completed: row.is_completed,
            },
          },
        };
      } else {
        acc[habit_id].habitLogs[row.log_date.toISOString()] = {
          log_id: row.log_id,
          log_date: row.log_date,
          is_completed: row.is_completed,
        };
      }
      return acc;
    }, {});

    res.json(Object.values(habits));
  } catch (error) {
    console.error("Error fetching habits and logs:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching habits and logs" });
  }
};

module.exports = {
  createHabit,
  getAllHabits,
  logHabit,
  getTodaysHabits,
  getHabitsByDate,
  editHabit,
  deleteHabit,
  getHabitsByWeek,
  getAllHabitsWithLogs,
};
