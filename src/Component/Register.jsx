import React, { useState } from 'react';
import './Register.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Verification from './Verification';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [ErrorMessage,setErrorMessage]=useState()
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [token, setToken] = useState('');
  const navigate = useNavigate();
  const apiurl = process.env.REACT_APP_API_BASE_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData.username);
  
    try {
      const response = await axios.post(`${apiurl}api/auth/register`, {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      setToken(response.data.token);
      console.log(response.data.token);
      setShowOtpModal(true);
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.status === 400) {
          console.error('Email already exists');
          setErrorMessage('Email already exists');
        } else {
          console.error('Error during registration:', error.message);
          setErrorMessage('Registration failed. Please try again.');
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        setErrorMessage('No response from server. Please try again later.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error during registration:', error.message);
        setErrorMessage('Registration failed. Please try again.');
      }
    }
  };
  
  return (
    <div className='register-container'>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />

        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
        />

        <button type="submit">Register</button>
        <p>{ErrorMessage}</p>
        {/* <button onClick={ navigate('/login')}> Already register move to login </button> */}
      </form>
      <Verification
        token={token}
        email={formData.email}
        username={formData.username}
        password={formData.password}
        showOtpModal={showOtpModal}
        setShowOtpModal={setShowOtpModal}
      />
    </div>
  );
};

export default RegisterForm;
