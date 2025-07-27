import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Confirm_Password = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const resetPassword = async () => {
    if (!password || !confirm) {
      setMessage('All fields are required.');
      setIsError(true);
      return;
    }

    if (password !== confirm) {
      setMessage('Passwords do not match.');
      setIsError(true);
      return;
    }

    try {
      const response = await fetch('http://localhost:7000/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Password updated successfully.');
        setIsError(false);
        navigate('/login');
      } else {
        setMessage(data.message);
        setIsError(true);
      }
    } catch (error) {
      setMessage('Server error.');
      setIsError(true);
    }
  };

  return (
    <div className="container is-fluid">
      <div className="box" style={{ maxWidth: '380px', margin: 'auto', marginTop: '40px' }}>
        <h1 className="title is-3 has-text-centered">Confirm Password</h1>

        {message && (
          <div className={`notification ${isError ? 'is-danger' : 'is-success'} is-light`}>
            {message}
          </div>
        )}

        <div className="field">
          <label className="label">New Password</label>
          <div className="control">
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </div>
        </div>

        <div className="field">
          <label className="label">Confirm Password</label>
          <div className="control">
            <input
              className="input"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Re-enter new password"
            />
          </div>
        </div>

        <button className="button is-primary is-fullwidth mt-4" onClick={resetPassword}>
          Change Password
        </button>
      </div>
    </div>
  );
};

export default Confirm_Password;
