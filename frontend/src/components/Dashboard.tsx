import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import type { Student } from "../../types";
import "./Dashboard.css";

export function Dashboard({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, token, logout } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    prn_no: "",
    program: "",
    username: "",
    password: ""
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:3000/");
      if (!res.ok) throw new Error("Failed to fetch students");
      const data = await res.json();
      setStudents(data.students ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setFormData({ name: "", prn_no: "", program: "", username: "", password: "" });
    setEditingId(null);
    setShowForm(true);
  };

  const handleEditClick = (student: Student) => {
    setFormData({
      name: student.name,
      prn_no: student.prn_no.toString(),
      program: student.program,
      username: "",
      password: ""
    });
    setEditingId(student.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (editingId) {
        // Update student
        const res = await fetch(`http://localhost:3000/student/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: formData.name,
            prn_no: parseInt(formData.prn_no),
            program: formData.program
          })
        });
        if (!res.ok) throw new Error("Failed to update student");
      } else {
        // Create student
        const res = await fetch("http://localhost:3000/student", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: formData.name,
            prn_no: parseInt(formData.prn_no),
            program: formData.program,
            username: formData.username,
            password: formData.password
          })
        });
        if (!res.ok) throw new Error("Failed to create student");
      }
      await fetchStudents();
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Operation failed");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;

    try {
      const res = await fetch(`http://localhost:3000/student/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      if (!res.ok) throw new Error("Failed to delete student");
      await fetchStudents();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const handleLogout = () => {
    logout();
    onNavigate('login');
  };

  // Filter students based on search query
  const filteredStudents = students.filter(student => {
    const query = searchQuery.toLowerCase();
    return (
      student.name.toLowerCase().includes(query) ||
      student.prn_no.toString().includes(query) ||
      student.program.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return <div className="dashboard"><p>Loading students...</p></div>;
  }

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="navbar-brand">Student Management System</div>
        <div className="navbar-user">
          <span>Welcome, {user?.name}</span>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </nav>

      <div className="container">
        <div className="dashboard-header">
          <h2>Students</h2>
          <div className="header-actions">
            <input
              type="text"
              placeholder="Search by name, PRN, or program..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button onClick={handleAddClick} className="btn-add-student">
              + Add Student
            </button>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {showForm && (
          <div className="form-container">
            <h3>{editingId ? "Edit Student" : "Add New Student"}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>PRN Number</label>
                <input
                  type="number"
                  value={formData.prn_no}
                  onChange={(e) => setFormData({ ...formData, prn_no: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Program</label>
                <input
                  type="text"
                  value={formData.program}
                  onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                  placeholder="e.g., MSC Blockchain"
                  required
                />
              </div>
              {!editingId && (
                <>
                  <div className="form-group">
                    <label>Username</label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Password</label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                  </div>
                </>
              )}
              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  {editingId ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="students-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>PRN Number</th>
                <th>Program</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center">
                    {searchQuery ? "No students match your search" : "No students found"}
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student: Student) => (
                  <tr key={student.id}>
                    <td>{student.id}</td>
                    <td>{student.name}</td>
                    <td>{student.prn_no}</td>
                    <td>{student.program}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => handleEditClick(student)}
                          className="btn-edit"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(student.id)}
                          className="btn-delete"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
