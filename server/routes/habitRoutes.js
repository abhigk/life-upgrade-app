const express = require("express");
const router = express.Router();
const {
  createHabit,
  getAllHabits,
  logHabit,
  editHabit,
  deleteHabit,
  getAllHabitsWithLogs,
  removeHabitLog,
} = require("../controllers/habitController");

router.post("/create", createHabit);
router.post("/log", logHabit);
router.get("/:user_id", getAllHabitsWithLogs);
// router.get("/:user_id/today", getTodaysHabits);
// router.get("/:user_id/:date", getHabitsByDate);
router.put("/edit/:habit_id", editHabit);
router.delete("/:habit_id", deleteHabit);
router.delete("/:userId/log/:habitLogId", removeHabitLog);
// router.get("/:user_id/week/:date", getHabitsByWeek);

module.exports = router;
