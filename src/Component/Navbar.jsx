import React, { useState, useEffect } from 'react';
import './Navbar.css'; // Import the CSS file for styling
import logobyte from '../Assets/bytebill.png';
import { ReactComponent as LogoByte } from '../Assets/bill.svg';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Navbar = ({ token, addbill }) => {
  const [showModal, setShowModal] = useState(false); // State to manage modal visibility
  const [name, setName] = useState('');
  const [billId, setBillId] = useState('');
  const apiurl = process.env.REACT_APP_API_BASE_URL;

  const postbill = async (bill) => {
    try {
      const response = await axios.post(
        `${apiurl}api/bill/postbill`,
        { billNo: bill, billName: name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      addbill();
    } catch (e) {
      console.log(e.message);
    }
  };

  const toggleModal = () => {
    setShowModal(!showModal); // Toggle modal visibility
  };

  const handleChange = (e) => {
    setName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Token:', token);
    console.log('Name submitted:', name); // You can replace this with your logic
    generateBillId(); // Generate bill ID
    toggleModal(); // Close the current modal
    // Set a timeout to remove the bill ID after 5 minutes
    setTimeout(() => {
      setBillId('');
    }, 3 * 1000); // 5 minutes in milliseconds
  };

  const generateBillId = async () => {
    try {
      const response = await axios.get(`${apiurl}api/bill/lastbill`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Last bill data:", response.data);

      if (response.data.bill_no === undefined) {
        const billno = 'byt 1';
        postbill(billno);
        setBillId(billno);
      } else {
        const valu = response.data.bill_no.split(' ');
        const reslut = parseFloat(valu[1]);
        const counter = reslut + 1;
        const newbill = `byt ${counter}`;
        postbill(newbill);
        setBillId(newbill);
      }
    } catch (error) {
      console.error('Error adding item:', error.message);
    }
  };

  useEffect(() => {
    // Clean up bill ID after 5 minutes if it's still there
    const timeout = setTimeout(() => {
      setBillId('');
    }, 3* 1000); // 5 minutes in milliseconds

    return () => clearTimeout(timeout);
  }, [billId]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '+') {
        toggleModal();
      } else if (e.key === 'Escape' && showModal) {
        toggleModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showModal]);


  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/home">
          <img src={logobyte} alt="Logo" />
        </Link>
      </div>
      <div className="navbar-icon" onClick={toggleModal}>
        <LogoByte />
      </div>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="close-button" onClick={toggleModal}>×</button>
            <h2>Enter Your Name</h2>
            <form onSubmit={handleSubmit}>
              <input type="text" value={name} onChange={handleChange} />
              <button className="button1" type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}
      {billId && (
        <div className="billid-popup">
          <p>Bill ID: {billId}</p>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
