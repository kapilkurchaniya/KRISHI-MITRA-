import React, { useState } from 'react';
import "../styles/Register.scss";
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useauth';

const Register = () => {

  const { loading, handleRegister } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    await handleRegister({username , email ,password })
navigate("/")
  }

  return (
    <div className='register-container'>
      <form className='form-container' onSubmit={handleSubmit}>  

        <h1>Register</h1>

        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button 
          className='submit-button' 
          type="submit" 
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p>
          Already have an account? <Link to="/login">Login here</Link>
        </p>

      </form>
    </div>
  );
}

export default Register;