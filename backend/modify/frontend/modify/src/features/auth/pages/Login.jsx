import '../styles/Login.scss';
import { Link, Navigate } from 'react-router';
import { useAuth } from '../hooks/useauth';
import { useState } from 'react';
import { useNavigate } from 'react-router';

const Login = () => {
  const { loading, handleLogin } = useAuth(); 
  const Navigate = useNavigate()

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    // call login function
    await handleLogin({ email, password });
    Navigate("/")
  }

  return (
    <main className="login-page">
      <div className="form-container">
        <h1>Login</h1>

        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email" id="email" name="email" required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password" id="password" name="password" required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="submit-button" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <p>
            Don't have an account? <Link to="/register">Register here</Link>
          </p>

        </form>
      </div>
    </main>
  );
};

export default Login;