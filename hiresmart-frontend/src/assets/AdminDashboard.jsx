import { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {

    try {

      const response = await axios.get(
        "http://localhost:8080/api/admin/users",
        {
          headers: {
            Authorization:
              `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      setUsers(response.data);

    } catch (error) {

      console.log(
        "ADMIN USERS ERROR:",
        error
      );

      setMessage(
        error.response?.data?.message ||
        "Could not load users."
      );

    } finally {

      setLoading(false);

    }
  };


  const changeRole = async (userId, role) => {

    try {

      await axios.put(
        `http://localhost:8080/api/admin/users/${userId}/role`,
        {
          role: role
        },
        {
          headers: {
            Authorization:
              `Bearer ${localStorage.getItem("token")}`,
            "Content-Type":
              "application/json"
          }
        }
      );

      setMessage(
        "User role updated successfully."
      );

      loadUsers();

    } catch (error) {

      console.log(
        "ROLE UPDATE ERROR:",
        error
      );

      setMessage(
        error.response?.data?.message ||
        "Could not update role."
      );

    }
  };


  const deleteUser = async (userId) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this user?"
      );

    if (!confirmDelete) {
      return;
    }

    try {

      await axios.delete(
        `http://localhost:8080/api/admin/users/${userId}`,
        {
          headers: {
            Authorization:
              `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      setMessage(
        "User deleted successfully."
      );

      loadUsers();

    } catch (error) {

      console.log(
        "DELETE USER ERROR:",
        error
      );

      setMessage(
        error.response?.data?.message ||
        "Could not delete user."
      );

    }
  };


  const candidates = users.filter(
    (user) => user.role === "CANDIDATE"
  );

  const recruiters = users.filter(
    (user) => user.role === "RECRUITER"
  );

  const admins = users.filter(
    (user) => user.role === "ADMIN"
  );


  if (loading) {

    return (
      <div>

        <h2>Admin Dashboard</h2>

        <p>
          Loading users...
        </p>

      </div>
    );

  }


  return (

    <div>

      <h2>Admin Dashboard</h2>

      {message && (
        <p>{message}</p>
      )}


      <h3>
        System Statistics
      </h3>

      <p>
        Total Users: {users.length}
      </p>

      <p>
        Candidates: {candidates.length}
      </p>

      <p>
        Recruiters: {recruiters.length}
      </p>

      <p>
        Admins: {admins.length}
      </p>


      <hr />


      <h3>
        User Management
      </h3>


      {users.length === 0 ? (

        <p>
          No users found.
        </p>

      ) : (

        users.map((user) => (

          <div key={user.id}>

            <h4>
              {user.name}
            </h4>

            <p>
              ID: {user.id}
            </p>

            <p>
              Email: {user.email}
            </p>

            <p>
              Current Role:{" "}
              <strong>
                {user.role}
              </strong>
            </p>


            <select
              value={user.role}
              onChange={(e) =>
                changeRole(
                  user.id,
                  e.target.value
                )
              }
            >

              <option value="CANDIDATE">
                CANDIDATE
              </option>

              <option value="RECRUITER">
                RECRUITER
              </option>

              <option value="ADMIN">
                ADMIN
              </option>

            </select>


            {" "}


            <button
              onClick={() =>
                deleteUser(user.id)
              }
            >
              Delete
            </button>


            <hr />

          </div>

        ))

      )}

    </div>

  );
}

export default AdminDashboard;