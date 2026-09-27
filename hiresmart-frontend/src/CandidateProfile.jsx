import { useEffect, useState } from "react";
import axios from "axios";

function CandidateProfile() {

  const [profile, setProfile] = useState({
    phone: "",
    location: "",
    skills: "",
    education: "",
    experience: "",
    linkedin: "",
    github: ""
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");


  // ========================================
  // LOAD PROFILE
  // ========================================

  useEffect(() => {

    loadProfile();

  }, []);


  const loadProfile = async () => {

    try {

      const response = await axios.get(
        "http://localhost:8080/api/candidate/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setProfile({

        phone: response.data.phone || "",
        location: response.data.location || "",
        skills: response.data.skills || "",
        education: response.data.education || "",
        experience: response.data.experience || "",
        linkedin: response.data.linkedin || "",
        github: response.data.github || ""

      });

    } catch (error) {

      console.log("PROFILE ERROR:", error);

      setMessage(
        error.response?.data?.message ||
        "Could not load profile."
      );

    } finally {

      setLoading(false);

    }

  };


  // ========================================
  // HANDLE INPUT
  // ========================================

  const handleChange = (e) => {

    setProfile({

      ...profile,

      [e.target.name]: e.target.value

    });

  };


  // ========================================
  // SAVE PROFILE
  // ========================================

  const saveProfile = async (e) => {

    e.preventDefault();

    setMessage("");

    try {

      const response = await axios.put(
        "http://localhost:8080/api/candidate/profile",
        profile,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      setProfile({

        phone: response.data.phone || "",
        location: response.data.location || "",
        skills: response.data.skills || "",
        education: response.data.education || "",
        experience: response.data.experience || "",
        linkedin: response.data.linkedin || "",
        github: response.data.github || ""

      });

      setMessage(
        "Profile saved successfully!"
      );

    } catch (error) {

      console.log(
        "SAVE PROFILE ERROR:",
        error
      );

      setMessage(
        error.response?.data?.message ||
        "Failed to save profile."
      );

    }

  };


  // ========================================
  // LOADING
  // ========================================

  if (loading) {

    return (
      <div className="page-panel loading-panel">
        <div className="section-header">
          <div>
            <span className="eyebrow">Profile settings</span>
            <h2>My profile</h2>
          </div>
        </div>
        <div className="loading-state">Loading profile...</div>
      </div>
    );

  }


  // ========================================
  // PROFILE FORM
  // ========================================

  return (

    <div className="page-panel">
      <div className="section-header">
        <div>
          <span className="eyebrow">Profile settings</span>
          <h2>My profile</h2>
        </div>
      </div>

      <form className="modern-form profile-form" onSubmit={saveProfile}>
        <div className="form-grid">
          <div className="field-group">
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              placeholder="Enter phone number"
              value={profile.phone}
              onChange={handleChange}
            />
          </div>

          <div className="field-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              placeholder="Kochi, Kerala"
              value={profile.location}
              onChange={handleChange}
            />
          </div>

          <div className="field-group full-width">
            <label>Skills</label>
            <input
              type="text"
              name="skills"
              placeholder="Java, Spring Boot, React, MySQL"
              value={profile.skills}
              onChange={handleChange}
            />
          </div>

          <div className="field-group full-width">
            <label>Education</label>
            <input
              type="text"
              name="education"
              placeholder="B.Tech Computer Science Engineering"
              value={profile.education}
              onChange={handleChange}
            />
          </div>

          <div className="field-group full-width">
            <label>Experience</label>
            <input
              type="text"
              name="experience"
              placeholder="Fresher"
              value={profile.experience}
              onChange={handleChange}
            />
          </div>

          <div className="field-group">
            <label>LinkedIn</label>
            <input
              type="text"
              name="linkedin"
              placeholder="https://linkedin.com/in/username"
              value={profile.linkedin}
              onChange={handleChange}
            />
          </div>

          <div className="field-group">
            <label>GitHub</label>
            <input
              type="text"
              name="github"
              placeholder="https://github.com/username"
              value={profile.github}
              onChange={handleChange}
            />
          </div>
        </div>

        <button type="submit" className="primary-button">
          Save profile
        </button>
      </form>

      {message && (
        <div className="inline-success">{message}</div>
      )}
    </div>

  );

}


// ========================================
// DEFAULT EXPORT
// ========================================

export default CandidateProfile;