import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Reset_Password = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const sendOTP = async () => {
    if (!email) {
      setMessage('Please enter your email address.');
      setIsError(true);
      return;
    }

    try {
      const response = await fetch('http://localhost:7000/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setIsError(false);
        setStep(2);
      } else {
        setMessage(data.message);
        setIsError(true);
      }
    } catch (error) {
      setMessage('Server error. Please try again.');
      setIsError(true);
    }
  };

  const verifyOTP = async () => {
    if (!otp) {
      setMessage('Please enter the OTP.');
      setIsError(true);
      return;
    }

    try {
      const response = await fetch('http://localhost:7000/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setIsError(false);
        navigate('/confirm-password', { state: { email } });
      } else {
        setMessage(data.message);
        setIsError(true);
      }
    } catch (error) {
      setMessage('Failed to verify OTP.');
      setIsError(true);
    }
  };

  return (
    <div className="container is-fluid">
      <div className="box" style={{ maxWidth: '380px', margin: 'auto', marginTop: '40px' }}>
        <div className="block">
          <span className="icon-text">
            <span className="icon is-medium mr-2">
              <img src="https://img.icons8.com/fluency/48/000000/meta.png" alt="meta" />
            </span>
            <span className="is-size-5 has-text-weight-medium mt-1">KETO</span>
          </span>
        </div>
        <hr />
        <h1 className="title is-3 has-text-centered">Reset Password</h1>

        {message && (
          <div className={`notification ${isError ? 'is-danger' : 'is-success'} is-light`}>
            {message}
          </div>
        )}

        {step === 1 && (
          <>
            <div className="field">
              <label className="label">Enter your email:</label>
              <div className="control">
                <input
                  className="input"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <button className="button is-link is-fullwidth mt-3" onClick={sendOTP}>
              Send OTP
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div className="field">
              <label className="label">Enter OTP:</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
            </div>
            <button className="button is-success is-fullwidth mt-3" onClick={verifyOTP}>
              Verify OTP
            </button>
          </>
        )}

        <div className="block has-text-centered mt-4">
          <Link to="/login">
            <button className="button is-link is-centered is-inverted has-background-white" style={{ fontSize: '14px' }}>
              Return to Login
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Reset_Password;
