const express = require("express");
const router = express.Router();
const { createHabit, getHabits } = require("../controllers/habitController");

router.post("/", createHabit);
router.get("/:user_id", getHabits);

module.exports = router;
