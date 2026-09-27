import { useEffect, useState } from "react";
import axios from "axios";

function RecruiterApplicants() {

    const [applicants, setApplicants] = useState([]);
    const [message, setMessage] = useState("");

    const token = localStorage.getItem("token");

    const loadApplicants = async () => {

        try {

            const response = await axios.get(
                "http://localhost:8080/api/recruiter/applicants",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setApplicants(response.data);

        } catch (error) {

            console.error(
                "APPLICANTS ERROR:",
                error
            );

            setMessage(
                "Failed to load applicants"
            );

        }

    };

    useEffect(() => {
        loadApplicants();
    }, []);

    const updateStatus = async (applicationId, status) => {
        try {
            await axios.put(
                `http://localhost:8080/api/recruiter/applications/${applicationId}/status`,
                {
                    status: status
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMessage(`Application ${status.toLowerCase()} successfully`);
            loadApplicants();
        } catch (error) {
            console.error("STATUS UPDATE ERROR:", error);
            setMessage("Failed to update application");
        }
    };

    const getStatusClass = (status) => {
        if (!status) return "status-badge neutral";
        return `status-badge ${status.toLowerCase()}`;
    };

    return (
        <div className="page-panel recruiter-applicants-panel">
            <div className="section-header">
                <div>
                    <span className="eyebrow">Recruiter pipeline</span>
                    <h2>Applicant review</h2>
                </div>
            </div>

            {message && <div className="inline-success">{message}</div>}

            {applicants.length === 0 ? (
                <div className="empty-state">No applicants found.</div>
            ) : (
                <div className="admin-table-wrap">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Candidate</th>
                                <th>Email</th>
                                <th>Job</th>
                                <th>ATS Score</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applicants.map((applicant) => (
                                <tr key={applicant.applicationId}>
                                    <td>{applicant.candidateName}</td>
                                    <td>{applicant.candidateEmail}</td>
                                    <td>{applicant.jobTitle}</td>
                                    <td>
                                        {applicant.atsScore !== null && applicant.atsScore !== undefined
                                            ? `${Number(applicant.atsScore).toFixed(2)}%`
                                            : "Not analyzed"}
                                    </td>
                                    <td>
                                        <span className={getStatusClass(applicant.status)}>{applicant.status}</span>
                                    </td>
                                    <td>
                                        <div className="action-row table-actions">
                                            <button className="secondary-button" onClick={() => updateStatus(applicant.applicationId, "SHORTLISTED")}>Shortlist</button>
                                            <button className="danger-button" onClick={() => updateStatus(applicant.applicationId, "REJECTED")}>Reject</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default RecruiterApplicants;