const express = require("express");
const cors = require("cors");
const pg = require("pg");
require("dotenv").config();

const app = express();

// PostgreSQL Connection (Supabase)
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Test DB connection
pool.connect()
  .then(() => console.log("✅ Connected to Supabase PostgreSQL"))
  .catch(err => console.error("❌ DB Connection Error:", err));

// CORS
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false
}));

app.use(express.json());

const PORT = process.env.PORT || 8080;

// ============ HEALTH CHECK ============
app.get("/user", (req, res) => {
  res.status(200).send({ op: "Success" });
});

// ============ CRUD ROUTES USING DATABASE ============

// CREATE USER
app.post("/api/users", async (req, res) => {
  const { name } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({ error: "Name is required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO users(name) VALUES($1) RETURNING *",
      [name.trim()]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("POST Error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// GET ALL USERS
app.get("/api/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users ORDER BY id ASC");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("GET Error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// UPDATE USER
app.put("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({ error: "Name is required" });
  }

  try {
    const result = await pool.query(
      "UPDATE users SET name=$1 WHERE id=$2 RETURNING *",
      [name.trim(), id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("PUT Error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// DELETE USER
app.delete("/api/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM users WHERE id=$1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "User deleted successfully",
      user: result.rows[0]
    });
  } catch (err) {
    console.error("DELETE Error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// START SERVER
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});