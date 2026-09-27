import { useEffect, useState } from "react";
import axios from "axios";

function CandidateDashboard() {

  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {

    try {

      const headers = {
        Authorization: `Bearer ${token}`
      };

      const profileResponse = await axios.get(
        "http://localhost:8080/api/candidate/profile",
        {
          headers: headers
        }
      );

      const applicationsResponse = await axios.get(
        "http://localhost:8080/api/candidate/applications",
        {
          headers: headers
        }
      );

      setProfile(profileResponse.data);
      setApplications(applicationsResponse.data);

    } catch (error) {

      console.log("DASHBOARD ERROR:", error);

      setError(
        error.response?.data?.message ||
        "Could not load dashboard."
      );

    } finally {

      setLoading(false);

    }

  };

  const totalApplications = applications.length;

  const shortlisted = applications.filter(
    (application) =>
      application.status === "SHORTLISTED"
  ).length;

  const rejected = applications.filter(
    (application) =>
      application.status === "REJECTED"
  ).length;

  const applied = applications.filter(
    (application) =>
      application.status === "APPLIED"
  ).length;

  const getStatusClass = (status) => {
    if (!status) return "status-badge neutral";
    return `status-badge ${status.toLowerCase()}`;
  };


  if (loading) {

    return (
      <div className="page-panel loading-panel">
        <div className="section-header">
          <div>
            <span className="eyebrow">Candidate workspace</span>
            <h2>Dashboard</h2>
          </div>
        </div>
        <div className="loading-state">Loading dashboard...</div>
      </div>
    );

  }


  return (

    <div className="page-panel">
      <div className="section-header">
        <div>
          <span className="eyebrow">Candidate workspace</span>
          <h2>Dashboard</h2>
        </div>
      </div>

      {error && (
        <div className="inline-error">{error}</div>
      )}

      <div className="stats-grid">
        <div className="stat-card accent">
          <span className="stat-label">Total applications</span>
          <strong>{totalApplications}</strong>
        </div>
        <div className="stat-card cyan">
          <span className="stat-label">Applied</span>
          <strong>{applied}</strong>
        </div>
        <div className="stat-card green">
          <span className="stat-label">Shortlisted</span>
          <strong>{shortlisted}</strong>
        </div>
        <div className="stat-card red">
          <span className="stat-label">Rejected</span>
          <strong>{rejected}</strong>
        </div>
      </div>

      <div className="content-grid two-col">
        <section className="info-card">
          <div className="card-head">
            <h3>My profile</h3>
          </div>

          {profile ? (
            <div className="profile-stack">
              <div className="profile-row">
                <span>Phone</span>
                <strong>{profile.phone || "Not added"}</strong>
              </div>
              <div className="profile-row">
                <span>Location</span>
                <strong>{profile.location || "Not added"}</strong>
              </div>
              <div className="profile-row">
                <span>Skills</span>
                <strong>{profile.skills || "Not added"}</strong>
              </div>
              <div className="profile-row">
                <span>Education</span>
                <strong>{profile.education || "Not added"}</strong>
              </div>
              <div className="profile-row">
                <span>Experience</span>
                <strong>{profile.experience || "Not added"}</strong>
              </div>
            </div>
          ) : (
            <div className="empty-state">Profile not found.</div>
          )}
        </section>

        <section className="info-card">
          <div className="card-head">
            <h3>Application overview</h3>
          </div>

          <div className="list-stack compact">
            <div className="mini-metric">
              <span>Total applications</span>
              <strong>{totalApplications}</strong>
            </div>
            <div className="mini-metric">
              <span>Applied</span>
              <strong>{applied}</strong>
            </div>
            <div className="mini-metric">
              <span>Shortlisted</span>
              <strong>{shortlisted}</strong>
            </div>
            <div className="mini-metric">
              <span>Rejected</span>
              <strong>{rejected}</strong>
            </div>
          </div>
        </section>
      </div>

      <section className="info-card applications-card">
        <div className="card-head">
          <h3>My applications</h3>
        </div>

        {applications.length === 0 ? (
          <div className="empty-state">You haven't applied for any jobs yet.</div>
        ) : (
          <div className="application-list">
            {applications.map((application) => (
              <div key={application.id} className="application-row">
                <div>
                  <h4>{application.jobTitle}</h4>
                  <p>{application.company}</p>
                </div>
                <div className="application-meta">
                  <span className={getStatusClass(application.status)}>{application.status}</span>
                  {application.atsScore !== null && application.atsScore !== undefined && (
                    <span className="ats-badge">ATS {Number(application.atsScore).toFixed(2)}%</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>

  );
}


// IMPORTANT: DEFAULT EXPORT

export default CandidateDashboard;