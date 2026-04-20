import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export function Register({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [name, setName] = useState('');
  const [prn_no, setPrnNo] = useState('');
  const [program, setProgram] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { register, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!name || !prn_no || !program || !username || !password) {
      setError('All fields are required');
      return;
    }

    try {
      await register(name, parseInt(prn_no), program, username, password);
      onNavigate('dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Student Registration</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="prn">PRN Number</label>
            <input
              id="prn"
              type="number"
              value={prn_no}
              onChange={(e) => setPrnNo(e.target.value)}
              placeholder="Enter PRN number"
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="program">Program</label>
            <input
              id="program"
              type="text"
              value={program}
              onChange={(e) => setProgram(e.target.value)}
              placeholder="e.g., MSC Blockchain"
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              disabled={isLoading}
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" disabled={isLoading} className="btn-primary">
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="auth-link">
          Already have an account? <button onClick={() => onNavigate('login')} className="link-button">Login here</button>
        </p>
      </div>
    </div>
  );
}
