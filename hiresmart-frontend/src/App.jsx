import { useEffect, useState } from "react";
import axios from "axios";

import "./App.css";

import Login from "./Login";
import CandidateProfile from "./CandidateProfile";
import CandidateDashboard from "./CandidateDashboard";
import RecruiterDashboard from "./RecruiterDashboard";
import RecruiterApplicants from "./RecruiterApplicants";
import AdminDashboard from "./AdminDashboard";
import ResumeATS from "./ResumeATS";

function Applications() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/candidate/applications", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      .then((response) => {
        setApplications(response.data);
      })
      .catch((error) => {
        console.log("APPLICATION ERROR:", error);
      });
  }, []);

  const getStatusClass = (status) => {
    if (!status) return "status-badge neutral";
    return `status-badge ${status.toLowerCase()}`;
  };

  return (
    <div className="page-panel">
      <div className="section-header">
        <div>
          <span className="eyebrow">Applications</span>
          <h2>My applications</h2>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="empty-state">No applications found.</div>
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
    </div>
  );
}

function App() {
  const [page, setPage] = useState(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      return "home";
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      if (payload.role === "RECRUITER") {
        return "recruiter";
      }

      if (payload.role === "ADMIN") {
        return "admin";
      }

      return "dashboard";
    } catch (error) {
      console.log("TOKEN ERROR:", error);
      return "home";
    }
  });

  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));

  const [userRole, setUserRole] = useState(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      return null;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.role;
    } catch (error) {
      return null;
    }
  });

  useEffect(() => {
    if (page === "jobs" && loggedIn && userRole === "CANDIDATE") {
      axios
        .get("http://localhost:8080/api/jobs", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        })
        .then((response) => {
          setJobs(response.data);
        })
        .catch((error) => {
          console.log("JOBS ERROR:", error);
        });
    }
  }, [page, loggedIn, userRole]);

  if (!loggedIn) {
    return (
      <Login
        onLogin={() => {
          const token = localStorage.getItem("token");

          try {
            const payload = JSON.parse(atob(token.split(".")[1]));

            setLoggedIn(true);
            setUserRole(payload.role);

            if (payload.role === "RECRUITER") {
              setPage("recruiter");
            } else if (payload.role === "ADMIN") {
              setPage("admin");
            } else {
              setPage("dashboard");
            }
          } catch (error) {
            console.log("TOKEN ERROR:", error);
            localStorage.removeItem("token");
            setLoggedIn(false);
            setUserRole(null);
            setPage("home");
          }
        }}
      />
    );
  }

  const applyForJob = async (jobId) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/candidate/applications/${jobId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      alert(response.data.message || "Application submitted successfully!");
    } catch (error) {
      console.log("APPLICATION ERROR:", error);

      if (error.response) {
        alert(error.response.data?.message || "Could not apply for this job");
      } else {
        alert("Server connection failed");
      }
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    setUserRole(null);
    setPage("home");
    setSelectedJob(null);
  };

  const filteredJobs = jobs.filter((job) => {
    const text = `${job.title} ${job.company} ${job.location} ${job.skills}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  const navItems = {
    candidate: [
      { key: "dashboard", label: "Dashboard" },
      { key: "jobs", label: "Jobs" },
      { key: "applications", label: "My Applications" },
      { key: "resume", label: "Resume & ATS" },
      { key: "profile", label: "Profile" }
    ],
    recruiter: [
      { key: "recruiter", label: "Recruiter Dashboard" },
      { key: "applicants", label: "Applicants" }
    ],
    admin: [
      { key: "admin", label: "Admin Dashboard" }
    ]
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-mark">H</div>
          <div>
            <div className="brand-name">HireSmart</div>
            <div className="brand-subtitle">AI Recruiting OS</div>
          </div>
        </div>

        <nav className="side-nav" aria-label="Main navigation">
          {userRole === "CANDIDATE" && navItems.candidate.map((item) => (
            <button
              key={item.key}
              className={page === item.key ? "nav-button active" : "nav-button"}
              onClick={() => setPage(item.key)}
            >
              {item.label}
            </button>
          ))}

          <button
            className={page === "home" ? "nav-button active" : "nav-button"}
            onClick={() => setPage("home")}
          >
            Home
          </button>

          {userRole === "RECRUITER" && navItems.recruiter.map((item) => (
            <button
              key={item.key}
              className={page === item.key ? "nav-button active" : "nav-button"}
              onClick={() => setPage(item.key)}
            >
              {item.label}
            </button>
          ))}

          {userRole === "ADMIN" && navItems.admin.map((item) => (
            <button
              key={item.key}
              className={page === item.key ? "nav-button active" : "nav-button"}
              onClick={() => setPage(item.key)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="secondary-button logout-button" onClick={logout}>Logout</button>
        </div>
      </aside>

      <div className="content-panel">
        <header className="topbar">
          <div>
            <span className="eyebrow">Talent intelligence</span>
            <h1>
              {page === "dashboard" && userRole === "CANDIDATE" && "Dashboard"}
              {page === "jobs" && userRole === "CANDIDATE" && "Open roles"}
              {page === "applications" && userRole === "CANDIDATE" && "Applications"}
              {page === "resume" && userRole === "CANDIDATE" && "Resume & ATS"}
              {page === "profile" && userRole === "CANDIDATE" && "Profile"}
              {page === "recruiter" && userRole === "RECRUITER" && "Recruiter dashboard"}
              {page === "applicants" && userRole === "RECRUITER" && "Applicants"}
              {page === "admin" && userRole === "ADMIN" && "Admin dashboard"}
              {page === "home" && "Overview"}
              {page === "jobDetails" && userRole === "CANDIDATE" && "Job details"}
            </h1>
          </div>
          <div className="topbar-tools">
            <div className="user-pill">{userRole || "Guest"}</div>
          </div>
        </header>

        <main className="page-content">
          {page === "dashboard" && userRole === "CANDIDATE" && <CandidateDashboard />}
          {page === "admin" && userRole === "ADMIN" && <AdminDashboard />}

          {page === "home" && (
            <div className="page-panel home-hero">
              <div className="hero-copy">
                <span className="eyebrow">AI-powered hiring</span>
                <h2>Welcome to HireSmart</h2>
                <p>
                  AI-powered job portal and applicant tracking system built to streamline hiring, matching, and decision-making.
                </p>
              </div>
            </div>
          )}

          {page === "jobDetails" && selectedJob && userRole === "CANDIDATE" && (
            <div className="page-panel job-details-panel">
              <div className="section-header compact-header">
                <button
                  className="secondary-button"
                  onClick={() => {
                    setSelectedJob(null);
                    setPage("jobs");
                  }}
                >
                  ← Back to jobs
                </button>
              </div>

              <div className="job-detail-card">
                <div className="job-detail-header">
                  <div>
                    <span className="eyebrow">Opportunity</span>
                    <h2>{selectedJob.title}</h2>
                  </div>
                  <button className="primary-button" onClick={() => applyForJob(selectedJob.id)}>
                    Apply now
                  </button>
                </div>

                <div className="job-spec-grid">
                  <div className="spec-item"><span>Company</span><strong>{selectedJob.company}</strong></div>
                  <div className="spec-item"><span>Location</span><strong>{selectedJob.location}</strong></div>
                  <div className="spec-item"><span>Experience</span><strong>{selectedJob.experience}</strong></div>
                  <div className="spec-item"><span>Salary</span><strong>{selectedJob.salary}</strong></div>
                </div>

                <div className="skill-badges">
                  {selectedJob.skills && selectedJob.skills.split(",").map((skill, index) => (
                    <span className="skill-badge" key={`${selectedJob.id}-${index}`}>{skill.trim()}</span>
                  ))}
                </div>

                <div className="detail-copy">
                  <h3>Job description</h3>
                  <p>{selectedJob.description}</p>
                </div>
              </div>
            </div>
          )}

          {page === "jobs" && userRole === "CANDIDATE" && (
            <div className="page-panel">
              <div className="section-header">
                <div>
                  <span className="eyebrow">Opportunity board</span>
                  <h2>Available jobs</h2>
                </div>
              </div>

              <div className="search-wrap">
                <input
                  type="text"
                  placeholder="Search jobs by title, company, location or skill"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {filteredJobs.length === 0 ? (
                <div className="empty-state">No matching jobs found.</div>
              ) : (
                <div className="job-grid">
                  {filteredJobs.map((job) => (
                    <article key={job.id} className="job-card">
                      <div className="job-card-head">
                        <div>
                          <h3>{job.title}</h3>
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
                      <div className="action-row">
                        <button
                          className="secondary-button"
                          onClick={() => {
                            setSelectedJob(job);
                            setPage("jobDetails");
                          }}
                        >
                          View details
                        </button>
                        <button className="primary-button" onClick={() => applyForJob(job.id)}>
                          Apply now
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}

          {page === "applications" && userRole === "CANDIDATE" && <Applications />}
          {page === "resume" && userRole === "CANDIDATE" && <ResumeATS />}
          {page === "profile" && userRole === "CANDIDATE" && <CandidateProfile />}
          {page === "recruiter" && userRole === "RECRUITER" && <RecruiterDashboard />}
          {page === "applicants" && userRole === "RECRUITER" && <RecruiterApplicants />}
        </main>
      </div>
    </div>
  );
}

export default App;