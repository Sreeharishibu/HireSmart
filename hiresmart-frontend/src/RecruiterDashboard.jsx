import { useEffect, useState } from "react";
import axios from "axios";

function RecruiterDashboard() {

  const [applicants, setApplicants] = useState([]);
  const [jobs, setJobs] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");

  const [editingJobId, setEditingJobId] = useState(null);

  const emptyJob = {
    title: "",
    company: "",
    location: "",
    experience: "",
    salary: "",
    skills: "",
    description: ""
  };

  const [job, setJob] = useState(emptyJob);

  useEffect(() => {
    loadApplicants();
    loadMyJobs();
  }, []);

  const loadApplicants = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/recruiter/applicants",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      setApplicants(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const loadMyJobs = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/recruiter/jobs/my",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      setJobs(response.data);
    } catch (error) {
      console.log(error);
      setMessage("Could not load your jobs");
    }
  };

  const handleChange = (e) => {
    setJob({
      ...job,
      [e.target.name]: e.target.value
    });
  };

  const saveJob = async (e) => {
    e.preventDefault();

    try {
      if (editingJobId) {
        await axios.put(
          `http://localhost:8080/api/recruiter/jobs/${editingJobId}`,
          job,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );

        setMessage("Job updated successfully!");
      } else {
        await axios.post(
          "http://localhost:8080/api/recruiter/jobs",
          job,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );

        setMessage("Job posted successfully!");
      }

      setJob(emptyJob);
      setEditingJobId(null);
      setShowForm(false);
      loadMyJobs();
    } catch (error) {
      console.log(error);
      setMessage(error.response?.data?.message || "Could not save job");
    }
  };

  const editJob = (job) => {
    setJob({
      title: job.title,
      company: job.company,
      location: job.location,
      experience: job.experience,
      salary: job.salary,
      skills: job.skills,
      description: job.description
    });

    setEditingJobId(job.id);
    setShowForm(true);
    setMessage("");
  };

  const deleteJob = async (jobId) => {
    const confirmed = window.confirm("Are you sure you want to delete this job?");

    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:8080/api/recruiter/jobs/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      setMessage("Job deleted successfully!");
      loadMyJobs();
    } catch (error) {
      console.log(error);
      setMessage(error.response?.data?.message || "Could not delete job");
    }
  };

  const updateStatus = async (applicationId, status) => {
    try {
      await axios.put(
        `http://localhost:8080/api/recruiter/applications/${applicationId}/status`,
        {
          status: status
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      setMessage(`Application ${status.toLowerCase()} successfully.`);
      loadApplicants();
    } catch (error) {
      console.log(error);
      setMessage(error.response?.data?.message || "Could not update application");
    }
  };

  const getStatusClass = (status) => {
    if (!status) return "status-badge neutral";
    return `status-badge ${status.toLowerCase()}`;
  };

  return (
    <div className="page-panel">
      <div className="section-header">
        <div>
          <span className="eyebrow">Recruiter workspace</span>
          <h2>Recruiter dashboard</h2>
        </div>
        <button
          className="primary-button"
          onClick={() => {
            if (showForm) {
              setShowForm(false);
              setEditingJobId(null);
              setJob(emptyJob);
            } else {
              setShowForm(true);
            }
          }}
        >
          {showForm ? "Close job form" : "Post new job"}
        </button>
      </div>

      {message && <div className="inline-success">{message}</div>}

      {showForm && (
        <section className="info-card form-card">
          <div className="card-head">
            <h3>{editingJobId ? "Edit job" : "Post new job"}</h3>
          </div>

          <form className="modern-form job-form" onSubmit={saveJob}>
            <div className="form-grid">
              <div className="field-group">
                <label>Job title</label>
                <input type="text" name="title" placeholder="Job Title" value={job.title} onChange={handleChange} required />
              </div>
              <div className="field-group">
                <label>Company</label>
                <input type="text" name="company" placeholder="Company" value={job.company} onChange={handleChange} required />
              </div>
              <div className="field-group">
                <label>Location</label>
                <input type="text" name="location" placeholder="Location" value={job.location} onChange={handleChange} required />
              </div>
              <div className="field-group">
                <label>Experience</label>
                <input type="text" name="experience" placeholder="Experience e.g. 0-2 years" value={job.experience} onChange={handleChange} required />
              </div>
              <div className="field-group">
                <label>Salary</label>
                <input type="text" name="salary" placeholder="Salary e.g. ₹4-6 LPA" value={job.salary} onChange={handleChange} required />
              </div>
              <div className="field-group">
                <label>Skills</label>
                <input type="text" name="skills" placeholder="Skills e.g. Java, Spring Boot, MySQL" value={job.skills} onChange={handleChange} required />
              </div>
              <div className="field-group full-width">
                <label>Description</label>
                <textarea name="description" placeholder="Job Description" value={job.description} onChange={handleChange} rows="6" required />
              </div>
            </div>

            <button type="submit" className="primary-button">
              {editingJobId ? "Update job" : "Create job"}
            </button>
          </form>
        </section>
      )}

      <div className="stats-grid compact-grid">
        <div className="stat-card accent">
          <span className="stat-label">Jobs posted</span>
          <strong>{jobs.length}</strong>
        </div>
        <div className="stat-card green">
          <span className="stat-label">Applicants</span>
          <strong>{applicants.length}</strong>
        </div>
        <div className="stat-card cyan">
          <span className="stat-label">Open roles</span>
          <strong>{jobs.length}</strong>
        </div>
      </div>

      <div className="content-grid two-col recruiter-grid">
        <section className="info-card">
          <div className="card-head">
            <h3>My jobs</h3>
          </div>

          {jobs.length === 0 ? (
            <div className="empty-state">You have not posted any jobs yet.</div>
          ) : (
            <div className="job-list">
              {jobs.map((job) => (
                <div key={job.id} className="job-card">
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
                  <div className="action-row">
                    <button className="secondary-button" onClick={() => editJob(job)}>Edit</button>
                    <button className="danger-button" onClick={() => deleteJob(job.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="info-card">
          <div className="card-head">
            <h3>Applicants</h3>
          </div>

          {applicants.length === 0 ? (
            <div className="empty-state">No applicants found.</div>
          ) : (
            <div className="applicant-list">
              {applicants.map((applicant) => (
                <div key={applicant.applicationId} className="applicant-row">
                  <div className="applicant-main">
                    <h4>{applicant.candidateName}</h4>
                    <p>{applicant.candidateEmail}</p>
                    <p>{applicant.jobTitle}</p>
                  </div>
                  <div className="applicant-side">
                    <span className={getStatusClass(applicant.status)}>{applicant.status}</span>
                    <span className="ats-badge">
                      {applicant.atsScore !== null && applicant.atsScore !== undefined
                        ? `ATS ${applicant.atsScore.toFixed(2)}%`
                        : "Not analyzed"}
                    </span>
                    <div className="action-row small-row">
                      <button className="secondary-button" onClick={() => updateStatus(applicant.applicationId, "SHORTLISTED")}>Shortlist</button>
                      <button className="danger-button" onClick={() => updateStatus(applicant.applicationId, "REJECTED")}>Reject</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default RecruiterDashboard;