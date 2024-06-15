import React, { useState } from 'react';
import './Login.css'; // Import your CSS file
import { Link } from 'react-router-dom';
import axios from 'axios'; // Import Axios
import { useNavigate } from 'react-router-dom';

const Login = ({ addthetoken }) => {
  const [ErrorMessage,setErrorMessage]=useState()
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const apiurl = process.env.REACT_APP_API_BASE_URL;
  console.log(apiurl);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('try to login');
    try {
      const response = await axios.post(`${apiurl}api/auth/login`, formData); // Assuming '/api/auth/login' is your login endpoint
      const token = response.data.token; // Assuming the response contains a 'token' field
      addthetoken(token);
      if (token) {
        navigate('/home'); // Call the addthetoken function to set the token in the parent component
      }
      console.log('Login successful. Token:', token);
      // Redirect or navigate to the home page or another route
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          setErrorMessage('Invalid email or password');
        } else {
          setErrorMessage('Login failed. Please try again.');
        }
      } else {
        setErrorMessage('An error occurred. Please try again.');
      }
      console.error('Login error:', error.message);
    }
  };


  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
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

        <button type="submit">Login</button>
        <p>{ErrorMessage}</p>
      </form>
    
    </div>
  );
};

export default Login;
