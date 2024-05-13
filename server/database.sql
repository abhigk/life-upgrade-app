CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    mobile VARCHAR(20) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE habits (
    habit_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    habit_name VARCHAR(255) NOT NULL,
    frequency VARCHAR(20) NOT NULL, -- daily, weekly, custom
    habit_description TEXT,
    custom_parameters JSONB, -- store custom parameters if needed
    created_at TIMESTAMPTZ DEFAULT NOW(),
    end_date DATE
    -- Add other relevant columns (e.g., habit description, reminders, etc.)
);

CREATE TABLE habitLogs (
    log_id SERIAL PRIMARY KEY,
    habit_id INTEGER NOT NULL REFERENCES habits(habit_id),
    user_id INT REFERENCES users(user_id),
    log_date DATE NOT NULL,
    is_completed BOOLEAN NOT NULL
);

CREATE TABLE habitStreak (
    streak_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id),
    habit_id INT NOT NULL REFERENCES habits(habit_id),
    current_streak INT NOT NULL,
    longest_streak INT NOT NULL,
    start_date DATE NOT NULL
);