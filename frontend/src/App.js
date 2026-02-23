import { useEffect, useState } from "react";
import { userAPI } from "./api/userAPI";
import "./App.css";

function App() {
  // State management
  const [users, setUsers] = useState([]);
  const [healthStatus, setHealthStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formState, setFormState] = useState({ name: "" });
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  // Load users and health check on component mount
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setLoading(true);
        setError(null);

        // Health check
        try {
          const healthData = await userAPI.healthCheck();
          setHealthStatus(healthData);
          console.log("✅ Backend is healthy");
        } catch (err) {
          console.warn("⚠️ Health check warning:", err.message);
        }

        // Fetch users
        const usersData = await userAPI.getAll();
        setUsers(usersData);
        console.log("✅ Loaded users:", usersData);
      } catch (err) {
        setError(err.message);
        console.error("❌ Initialization error:", err);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Handle form input change
  const handleInputChange = (e) => {
    const { value } = e.target;
    setFormState({ name: value });
  };

  // Handle create user
  const handleCreateUser = async (e) => {
    e.preventDefault();

    if (formState.name.trim() === "") {
      setError("Please enter a user name");
      return;
    }

    try {
      setError(null);
      const newUser = await userAPI.create({ name: formState.name });
      setUsers([...users, newUser]);
      setFormState({ name: "" });
      console.log("✅ User created and added to list");
    } catch (err) {
      setError(err.message);
      console.error("❌ Error creating user:", err);
    }
  };

  // Handle update user
  const handleEditUser = (user) => {
    setEditingId(user.id);
    setEditName(user.name);
  };

  const handleSaveEdit = async (userId) => {
    if (editName.trim() === "") {
      setError("User name cannot be empty");
      return;
    }

    try {
      setError(null);
      const updatedUser = await userAPI.update(userId, { name: editName });
      setUsers(users.map((u) => (u.id === userId ? updatedUser : u)));
      setEditingId(null);
      setEditName("");
      console.log("✅ User updated successfully");
    } catch (err) {
      setError(err.message);
      console.error("❌ Error updating user:", err);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName("");
  };

  // Handle delete user
  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        setError(null);
        await userAPI.delete(userId);
        setUsers(users.filter((u) => u.id !== userId));
        console.log("✅ User deleted successfully");
      } catch (err) {
        setError(err.message);
        console.error("❌ Error deleting user:", err);
      }
    }
  };

  // Loading state
  if (loading) {
    return <div className="container"><p>Loading...</p></div>;
  }

  return (
    <div className="container">
      <h1>User Management App</h1>

      {/* Health Status */}
      {healthStatus && (
        <div className="health-status">
          <p>✅ Backend Status: {JSON.stringify(healthStatus.op)}</p>
        </div>
      )}

      {/* Error Message */}
      {error && <div className="error-message">❌ {error}</div>}

      {/* Add User Form */}
      <div className="form-section">
        <h2>Add New User</h2>
        <form onSubmit={handleCreateUser}>
          <input
            type="text"
            placeholder="Enter user name"
            value={formState.name}
            onChange={handleInputChange}
            required
          />
          <button type="submit">Add User</button>
        </form>
      </div>

      {/* Users List */}
      <div className="users-section">
        <h2>Users ({users.length})</h2>
        {users.length === 0 ? (
          <p className="no-users">No users found. Add one to get started!</p>
        ) : (
          <ul className="users-list">
            {users.map((user) => (
              <li key={user.id} className="user-item">
                {editingId === user.id ? (
                  // Edit mode
                  <div className="edit-mode">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      autoFocus
                    />
                    <button
                      className="btn-save"
                      onClick={() => handleSaveEdit(user.id)}
                    >
                      Save
                    </button>
                    <button
                      className="btn-cancel"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  // View mode
                  <div className="view-mode">
                    <span className="user-id">ID: {user.id}</span>
                    <span className="user-name">{user.name}</span>
                    <button
                      className="btn-edit"
                      onClick={() => handleEditUser(user)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
