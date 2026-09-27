import { useState } from "react";
import axios from "axios";

function ResumeATS() {

  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [jobId, setJobId] = useState("");
  const [result, setResult] = useState(null);

  const uploadResume = async () => {
    if (!file) {
      setMessage("Please select a PDF resume.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/candidate/resume/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      setMessage(response.data.message || "Resume uploaded successfully.");
    } catch (error) {
      console.log("RESUME UPLOAD ERROR:", error);
      setMessage(error.response?.data?.message || "Resume upload failed");
    }
  };

  const analyzeResume = async () => {
    if (!jobId) {
      setMessage("Enter a Job ID.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8080/api/candidate/ats/analyze/${jobId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      setResult(response.data);
      setMessage("ATS analysis completed.");
    } catch (error) {
      console.log("ATS ERROR:", error);
      setMessage(error.response?.data?.message || "ATS analysis failed");
    }
  };

  const improveResume = async () => {
    if (!jobId) {
      setMessage("Enter a Job ID first.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8080/api/ai/improve/${jobId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      setResult((previousResult) => ({
        ...(previousResult || {}),
        aiMessage: response.data.message,
        aiSuggestions: response.data.suggestions
      }));

      setMessage("AI improvement suggestions generated.");
    } catch (error) {
      console.log("AI IMPROVEMENT ERROR:", error);
      setMessage(error.response?.data?.message || "AI improvement failed");
    }
  };

  return (
    <div className="page-panel">
      <div className="section-header">
        <div>
          <span className="eyebrow">Career intelligence</span>
          <h2>Resume & ATS</h2>
        </div>
      </div>

      <div className="content-grid two-col">
        <section className="info-card">
          <div className="card-head">
            <h3>Upload resume</h3>
          </div>

          <div className="file-upload-block">
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <button className="primary-button" onClick={uploadResume}>
              Upload resume
            </button>
          </div>
        </section>

        <section className="info-card">
          <div className="card-head">
            <h3>ATS analysis</h3>
          </div>

          <div className="modern-form inline-form">
            <div className="field-group">
              <label>Job ID</label>
              <input
                type="number"
                placeholder="Enter Job ID"
                value={jobId}
                onChange={(e) => setJobId(e.target.value)}
              />
            </div>
            <div className="action-row split">
              <button className="secondary-button" onClick={analyzeResume}>
                Analyze ATS
              </button>
              <button className="primary-button" onClick={improveResume}>
                Improve with AI
              </button>
            </div>
          </div>
        </section>
      </div>

      {message && <div className="inline-success">{message}</div>}

      {result && (
        <section className="info-card ats-result-card">
          <div className="card-head">
            <h3>ATS result</h3>
          </div>

          <div className="score-panel">
            <div className="score-ring">
              <span>{result.matchScore !== undefined ? Number(result.matchScore).toFixed(0) : 0}%</span>
            </div>
            <div className="score-details">
              <div className="score-row">
                <span>Match score</span>
                <strong>{result.matchScore !== undefined ? Number(result.matchScore).toFixed(2) + "%" : "Not available"}</strong>
              </div>
              <div className="score-row">
                <span>Matched skills</span>
                <strong>{result.matchedSkills || "None"}</strong>
              </div>
              <div className="score-row">
                <span>Missing skills</span>
                <strong>{result.missingSkills || "None"}</strong>
              </div>
            </div>
          </div>

          <div className="result-copy">
            <div className="result-block">
              <h4>Summary</h4>
              <p>{result.summary || "No summary available yet."}</p>
            </div>

            {result.aiMessage && (
              <div className="result-block">
                <h4>AI improvement</h4>
                <p>{result.aiMessage}</p>
              </div>
            )}

            {result.aiSuggestions && (
              <div className="result-block">
                <h4>Suggestions</h4>
                <ul className="suggestion-list">
                  {Array.isArray(result.aiSuggestions)
                    ? result.aiSuggestions.map((suggestion, index) => (
                        <li key={index}>{suggestion}</li>
                      ))
                    : <li>{result.aiSuggestions}</li>
                  }
                </ul>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

export default ResumeATS;