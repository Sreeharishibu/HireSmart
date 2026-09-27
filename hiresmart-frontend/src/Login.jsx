import { useState } from "react";
import axios from "axios";

function Login({ onLogin }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        {
          email: email,
          password: password
        }
      );

      localStorage.setItem("token", response.data.token);

      onLogin();

    } catch (error) {

      console.log(error);
      setError("Invalid email or password");

    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-visual">
          <div className="brand-block large">
            <div className="brand-mark">H</div>
            <div>
              <div className="brand-name">HireSmart</div>
              <div className="brand-subtitle">AI-powered hiring platform</div>
            </div>
          </div>

          <div className="auth-visual-copy">
            <span className="eyebrow">Recruit smarter</span>
            <h1>Hire with clarity, speed, and confidence.</h1>
            <p>
              Match candidates faster, surface qualified talent, and keep your hiring pipeline moving.
            </p>
          </div>

          <div className="feature-stack">
            <div className="mini-feature">
              <strong>ATS scoring</strong>
              <span>Resume intelligence</span>
            </div>
            <div className="mini-feature">
              <strong>Smart matching</strong>
              <span>Role-fit insights</span>
            </div>
            <div className="mini-feature">
              <strong>Hiring pipeline</strong>
              <span>End-to-end workflow</span>
            </div>
          </div>
        </div>

        <div className="auth-form-panel">
          <div className="auth-header">
            <span className="eyebrow">Welcome back</span>
            <h2>Login to HireSmart</h2>
          </div>

          <form className="modern-form" onSubmit={handleLogin}>
            <div className="field-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="field-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <div className="inline-error">{error}</div>}

            <button type="submit" className="primary-button auth-submit">
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;