import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../Navbar.jsx';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin, GoogleOAuthProvider, googleLogout } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import Footer from './Footer';

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:7000/login', form);
      alert(res.data.message);
      localStorage.setItem('loggedInUser', form.username);
      localStorage.setItem('customerId', res.data.customerId);
      navigate('/');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Login failed';
      setError(errorMsg);
    }
  };

  // const handleGoogleLogin = async (credentialResponse) => {
  //   try {
  //     const decoded = jwtDecode(credentialResponse.credential);
  //     const name = decoded.name;

  //     const res = await axios.post('http://localhost:7000/google-login', { name });

  //     localStorage.setItem('loggedInUser', name);
  //     localStorage.setItem('customerId', res.data.customerId);

  //     navigate('/');
  //   } catch (error) {
  //     console.error('Google login error:', error);
  //     alert('Google login failed');
  //   }
  // };

  const handleGoogleLogin = async (credentialResponse) => {
  try {
    const decoded = jwtDecode(credentialResponse.credential);
    const name = decoded.name;
    const email = decoded.email;  // <-- Must be present

    console.log("Decoded Google user:", decoded);  // for debugging

    if (!email) {
      alert("Email not available from Google. Cannot continue login.");
      return;
    }

    const res = await axios.post('http://localhost:7000/google-login', { name, email })
    .then((res)=>{
        localStorage.setItem('customerId', res.data.customerId);
        console.log(res.data);
    });

    localStorage.setItem('loggedInUser', name);
    
    

    navigate('/');
  } catch (error) {
    console.error('Google login error:', error);
    alert('Google login failed');
  }
};

const handleLogout = () => {
      googleLogout(); // Google logout
      localStorage.removeItem('loggedInUser');
      localStorage.removeItem('customerId');
      alert("Logged out successfully");
      navigate('/login');
    };

  const isLoggedIn = !!localStorage.getItem('loggedInUser');

  return (
    <div>
      <Navbar />
      <div className="container is-fluid mt-2">
        <div className="box mb-5" style={{ marginLeft: "220px", marginRight: "150px" }}>
          <div className="columns is-centered">
            <div className="column is-5">
              <img
                src="https://img.freepik.com/free-vector/access-control-system-abstract-concept_335657-3180.jpg"
                className="image"
                alt="login"
              />
            </div>
            <div className="column is-5">
              {error && (
                <div className="notification is-danger is-light">{error}</div>
              )}

              <div className="block">
                <span className="icon-text">
                  <span className="is-size-5 has-text-weight-medium mt-1">KETO</span>
                </span>
              </div>

              <hr />

              {!isLoggedIn ? (
                <>
                  {/* Username/Password Login Form */}
                  <form onSubmit={handleSubmit}>
                    <div className="field">
                      <label className="label">Username</label>
                      <div className="control">
                        <input
                          className="input"
                          type="text"
                          name="username"
                          value={form.username}
                          onChange={handleChange}
                          required
                          minLength="4"
                        />
                      </div>
                    </div>

                    <div className="field">
                      <label className="label">Password</label>
                      <div className="control">
                        <input
                          className="input"
                          type="password"
                          name="password"
                          value={form.password}
                          onChange={handleChange}
                          required
                          minLength="4"
                        />
                      </div>
                    </div>

                    <div className='block'>
                      <div className='field is-grouped is-grouped-right'>
                        <p>
                          <Link to="/reset_password">
                            <button type="button" className='button is-small is-inverted is-link has-background-white is-paddingless'>
                              Forgot Password?
                            </button>
                          </Link>
                        </p>
                      </div>
                    </div>

                    <div className="field mt-5">
                      <button className="button is-link" type="submit">Login</button>
                    </div>
                  </form>

                  <div className="has-text-centered has-text-grey is-size-6 mt-5">
                    Don't have an Account?
                    <Link to="/register" className='has-text-link has-text-weight-bold'> Register</Link>
                  </div>

                  {/* Google Login Button */}
                  <div className="has-text-centered mt-5">
                    <GoogleOAuthProvider clientId="383383244113-kaud4akjjtuefmgmc2m9g683uojllu1j.apps.googleusercontent.com">
                      <GoogleLogin
                        onSuccess={handleGoogleLogin}
                        onError={() => alert('Google login failed')}
                      />
                    </GoogleOAuthProvider>
                  </div>
                </>
              ) : (
                <div className="has-text-centered">
                  <p className="has-text-weight-semibold is-size-5 mb-4">
                    You are already logged in as <strong>{localStorage.getItem('loggedInUser')}</strong>
                  </p>
                  <button className="button is-danger" onClick={handleLogout}>Logout</button>
                </div>
              )}

              <div className="has-text-centered is-size-7 has-text-grey mt-4">
                A product of <strong>Keto</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
