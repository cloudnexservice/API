const express = require("express");
const cors = require("cors");

const app = express();

// CORS configuration - allows both production and local development
app.use(cors());

// JSON middleware for parsing request bodies
app.use(express.json());

const PORT = process.env.PORT || 8080;

// In-memory users database with sample data
let users = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Smith" },
  { id: 3, name: "Bob Johnson" }
];

let nextUserId = 4;

// ============ EXISTING ENDPOINT ============
app.get("/user", (req, res) => {
  console.log("GET /user - Health check");
  res.status(200).send({ op: "Success" });
});

// ============ CRUD ROUTES FOR USERS ============

// POST /api/users - Create a new user
app.post("/api/users", (req, res) => {
  const { name } = req.body;

  // Validation
  if (!name || name.trim() === "") {
    console.log("POST /api/users - Error: Missing name field");
    return res.status(400).json({ error: "Name is required" });
  }

  // Create new user
  const newUser = {
    id: nextUserId++,
    name: name.trim()
  };

  users.push(newUser);
  console.log(`POST /api/users - Created user:`, newUser);
  res.status(201).json(newUser);
});

// GET /api/users - Get all users
app.get("/api/users", (req, res) => {
  console.log("GET /api/users - Returning all users", users.length);
  res.status(200).json(users);
});

// PUT /api/users/:id - Update user by ID
app.put("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  // Validation
  if (!name || name.trim() === "") {
    console.log(`PUT /api/users/${id} - Error: Missing name field`);
    return res.status(400).json({ error: "Name is required" });
  }

  // Find and update user
  const user = users.find(u => u.id === parseInt(id));

  if (!user) {
    console.log(`PUT /api/users/${id} - Error: User not found`);
    return res.status(404).json({ error: "User not found" });
  }

  const oldName = user.name;
  user.name = name.trim();
  console.log(`PUT /api/users/${id} - Updated user ${id}: "${oldName}" → "${user.name}"`);
  res.status(200).json(user);
});

// DELETE /api/users/:id - Delete user by ID
app.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;

  // Find user index
  const userIndex = users.findIndex(u => u.id === parseInt(id));

  if (userIndex === -1) {
    console.log(`DELETE /api/users/${id} - Error: User not found`);
    return res.status(404).json({ error: "User not found" });
  }

  // Delete user
  const deletedUser = users.splice(userIndex, 1)[0];
  console.log(`DELETE /api/users/${id} - Deleted user:`, deletedUser);
  res.status(200).json({ message: "User deleted successfully", user: deletedUser });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Sample users loaded: ${users.length} users in memory`);
});
