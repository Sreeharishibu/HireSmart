# HireSmart — AI-Powered Job Portal & ATS

HireSmart is a full-stack AI-powered job portal and Applicant Tracking System (ATS) built using Spring Boot, React.js, MySQL, and Docker.

The platform connects candidates and recruiters through a centralized job management system while providing resume analysis, ATS compatibility scoring, skill-gap identification, and AI-powered resume improvement suggestions.

---

## 🚀 Features

### 👨‍💻 Candidate

- Secure login using JWT authentication
- Candidate dashboard
- Browse available jobs
- View job details
- Apply for jobs
- Track application status
- Upload PDF resume
- Automatic resume text extraction
- ATS compatibility analysis
- ATS match score calculation
- Matched skills identification
- Missing skills identification
- AI-powered resume improvement suggestions
- Candidate profile management

### 🏢 Recruiter

- Secure recruiter login
- Recruiter dashboard
- Create job postings
- Manage posted jobs
- View applicants
- View candidate information
- View ATS scores
- View matched and missing skills
- View resume information
- Shortlist candidates
- Reject candidates
- Update application status

### 🛡️ Admin

- Admin authentication
- Admin dashboard
- User management
- Job management
- Application management
- Platform-level monitoring

---

## 🤖 AI & ATS

HireSmart includes an ATS module that compares a candidate's resume against the skills required for a job.

### ATS Analysis

The system:

1. Accepts a candidate's PDF resume.
2. Extracts text from the PDF.
3. Stores the extracted resume content.
4. Compares resume skills with the job's required skills.
5. Calculates an ATS compatibility percentage.
6. Identifies matched skills.
7. Identifies missing skills.
8. Generates an analysis summary.

Example:

```text
Required Skills:
Java, SQL, Data Structures, Git, OOP

Matched:
Java
SQL
Data Structures
Git

Missing:
OOP

ATS Score:
80%
