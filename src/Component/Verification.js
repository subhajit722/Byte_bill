import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Verification = ({ token, email, username, password, showOtpModal, setShowOtpModal }) => {
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();
  const apiurl = process.env.REACT_APP_API_BASE_URL;

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const parsedOtp = parseInt(otp); // Parse the OTP string into an integer

    try {
      await axios.post(`${apiurl}api/auth/verify-otp`, {
        otpToken: token,
        otp: parsedOtp,
        username,
        email,
        password,
      });
      setShowOtpModal(false);
      navigate('/login');
    } catch (error) {
      console.error('Error verifying OTP:', error.message);
    }
  };

  return (
    <Modal
      isOpen={showOtpModal}
      onRequestClose={() => setShowOtpModal(false)}
      contentLabel="OTP Verification"
      className="otp-modal"
      overlayClassName="modal-overlay"
    >
      <button className="close-button" onClick={() => setShowOtpModal(false)}>×</button>
      <h2>Enter OTP</h2>
      <form onSubmit={handleOtpSubmit}>
        <div className="otp-input-container">
          <input
            type="text"
            className="otp-input"
            value={otp}
            onChange={handleOtpChange}
            maxLength="6"
          />
        </div>
        <button type="submit">Verify OTP</button>
      </form>
    </Modal>
  );
};

export default Verification;
