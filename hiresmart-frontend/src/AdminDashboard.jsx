import { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {

  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const getHeaders = () => {
    return {
      Authorization:
        `Bearer ${localStorage.getItem("token")}`
    };
  };

  const loadData = async () => {

    try {

      const usersResponse = await axios.get(
        "http://localhost:8080/api/admin/users",
        {
          headers: getHeaders()
        }
      );

      const jobsResponse = await axios.get(
        "http://localhost:8080/api/admin/jobs",
        {
          headers: getHeaders()
        }
      );

      setUsers(usersResponse.data);
      setJobs(jobsResponse.data);

    } catch (error) {

      console.log("ADMIN ERROR:", error);

      setMessage(
        error.response?.data?.message ||
        "Could not load admin data."
      );

    } finally {

      setLoading(false);

    }
  };

  const changeRole = (userId, newRole) => {

    setUsers(previousUsers =>
      previousUsers.map(user =>
        user.id === userId
          ? { ...user, selectedRole: newRole }
          : user
      )
    );
  };

  const updateRole = async (userId) => {

    const user = users.find(
      user => user.id === userId
    );

    if (!user) {
      return;
    }

    const newRole = user.selectedRole || user.role;

    try {

      await axios.put(
        `http://localhost:8080/api/admin/users/${userId}/role`,
        {
          role: newRole
        },
        {
          headers: {
            ...getHeaders(),
            "Content-Type": "application/json"
          }
        }
      );

      setMessage(
        "User role updated successfully."
      );

      await loadData();

    } catch (error) {

      console.log("ROLE UPDATE ERROR:", error);

      setMessage(
        error.response?.data?.message ||
        "Could not update user role."
      );
    }
  };

  const deleteUser = async (userId) => {

    const user = users.find(
      user => user.id === userId
    );

    if (!user) {
      return;
    }

    if (user.role === "ADMIN") {

      const adminCount =
        users.filter(
          user => user.role === "ADMIN"
        ).length;

      if (adminCount <= 1) {

        setMessage(
          "You cannot delete the only admin account."
        );

        return;
      }
    }

    if (!window.confirm(
      `Delete user ${user.name}?`
    )) {
      return;
    }

    try {

      await axios.delete(
        `http://localhost:8080/api/admin/users/${userId}`,
        {
          headers: getHeaders()
        }
      );

      setMessage(
        "User deleted successfully."
      );

      await loadData();

    } catch (error) {

      console.log("DELETE USER ERROR:", error);

      if (error.response?.status === 500) {

        setMessage(
          "This user cannot be deleted because other records are linked to this user."
        );

      } else {

        setMessage(
          error.response?.data?.message ||
          "Could not delete user."
        );
      }
    }
  };

  const deleteJob = async (jobId) => {

    if (!window.confirm(
      "Delete this job and all related applications?"
    )) {
      return;
    }

    try {

      await axios.delete(
        `http://localhost:8080/api/admin/jobs/${jobId}`,
        {
          headers: getHeaders()
        }
      );

      setMessage(
        "Job and related applications deleted successfully."
      );

      await loadData();

    } catch (error) {

      console.log("DELETE JOB ERROR:", error);

      setMessage(
        error.response?.data?.message ||
        "Could not delete job."
      );
    }
  };

  if (loading) {

    return (
      <div className="page-panel loading-panel">
        <div className="section-header">
          <div>
            <span className="eyebrow">Administration</span>
            <h2>Admin dashboard</h2>
          </div>
        </div>
        <div className="loading-state">Loading admin data...</div>
      </div>
    );
  }

  const candidates =
    users.filter(
      user => user.role === "CANDIDATE"
    );

  const recruiters =
    users.filter(
      user => user.role === "RECRUITER"
    );

  const admins =
    users.filter(
      user => user.role === "ADMIN"
    );

  return (
    <div className="page-panel">
      <div className="section-header">
        <div>
          <span className="eyebrow">Administration</span>
          <h2>Admin dashboard</h2>
        </div>
      </div>

      {message && <div className="inline-success">{message}</div>}

      <div className="stats-grid">
        <div className="stat-card accent">
          <span className="stat-label">Total users</span>
          <strong>{users.length}</strong>
        </div>
        <div className="stat-card cyan">
          <span className="stat-label">Candidates</span>
          <strong>{candidates.length}</strong>
        </div>
        <div className="stat-card green">
          <span className="stat-label">Recruiters</span>
          <strong>{recruiters.length}</strong>
        </div>
        <div className="stat-card red">
          <span className="stat-label">Admins</span>
          <strong>{admins.length}</strong>
        </div>
      </div>

      <div className="content-grid two-col admin-grid">
        <section className="info-card" id="admin-user-list">
          <div className="card-head">
            <h3>User management</h3>
          </div>

          {users.length === 0 ? (
            <div className="empty-state">No users found.</div>
          ) : (
            <div className="admin-table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Manage</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <select
                          value={user.selectedRole || user.role}
                          onChange={(e) => changeRole(user.id, e.target.value)}
                        >
                          <option value="CANDIDATE">CANDIDATE</option>
                          <option value="RECRUITER">RECRUITER</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      </td>
                      <td>
                        <div className="action-row table-actions">
                          <button className="secondary-button" onClick={() => updateRole(user.id)}>Update</button>
                          <button className="danger-button" onClick={() => deleteUser(user.id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="info-card" id="admin-job-list">
          <div className="card-head">
            <h3>Job management</h3>
          </div>

          {jobs.length === 0 ? (
            <div className="empty-state">No jobs found.</div>
          ) : (
            <div className="job-list compact-job-list">
              {jobs.map(job => (
                <div key={job.id} className="job-card admin-job-card">
                  <div className="job-card-head">
                    <div>
                      <h4>{job.title}</h4>
                      <p>{job.company}</p>
                    </div>
                  </div>
                  <div className="job-meta">
                    <span>{job.location}</span>
                    <span>{job.experience}</span>
                    <span>{job.salary}</span>
                  </div>
                  <div className="skill-badges">
                    {job.skills && job.skills.split(",").map((skill, index) => (
                      <span className="skill-badge" key={`${job.id}-${index}`}>{skill.trim()}</span>
                    ))}
                  </div>
                  <p className="job-description">{job.description}</p>
                  <button className="danger-button" onClick={() => deleteJob(job.id)}>Delete job</button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default AdminDashboard;