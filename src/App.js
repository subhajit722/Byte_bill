import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Component/Navbar';
import BottomNavbar from './Component/BottomNavbar';
import HomeScreen from './Component2/HomeScreen';
import AddItems from './Component2/AddItems';
import RegisterForm from './Component/Register';
import LoginForm from './Component/Login';
import Item from './Component2/Item';
import Dashboard from './Component2/Dashoard';

function App() {
  const [token, setToken] = useState('');
  const [retoken, setRetoken] = useState('');
  const [billid, setBillId] = useState(false);
  const [billData, setBillData] = useState({});
  const [items, setItems] = useState([]);

  const apiurl = process.env.REACT_APP_API_BASE_URL;

  const addthetoken = (to) => {
    localStorage.clear('token');
    localStorage.setItem('token', to);
  };

  useEffect(() => {
    const key = localStorage.getItem('token');
    console.log('Token from localStorage:', key);
    setToken(key);
  }, [addthetoken]);

  const addrethetoken = (to) => {
    setRetoken(to);
  };

  const addbill = () => {
    setBillId(!billid);
  };

  const getBill = async () => {
    try {
      const response = await axios.get(`${apiurl}api/bill/lastbill`, {
        headers: {
          Authorization: `Bearer ${token} `,
        },
      });
      setBillData(response.data);
    } catch (error) {
      console.error('Error fetching last bill:', error.message);
    }
  };

  const fetchItems = async () => {
    try {
      const response = await axios.get(`${apiurl}api/item/items`, {
        headers: {
          Authorization: `Bearer ${token} `,
        },
      });
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error.message);
    }
  };

  useEffect(() => {
    if (token) {
      getBill();
      fetchItems();
    }
  }, [token, billid]);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/register" />} />
          <Route path="/home" element={<HomeScreenWithNavbar token={token} billid={billid} billData={billData} items={items} addbill={addbill} />} />
          <Route path="/additems" element={<AddItemsWithNavbar token={token} />} />
          <Route path="/register" element={<RegisterForm addrethetoken={addrethetoken} />} />
          <Route path="/login" element={<LoginForm addthetoken={addthetoken} />} />
          <Route path="/items" element={<ProductWithNavbar token={token} />} />
          <Route path="/dashboard" element={<DashboardWithNavbar token={token} />} />
        </Routes>
      </div>
    </Router>
  );
}

// Component for pages with Navbar
const WithNavbar = ({ children, token, addbill }) => (
  <>
    <Navbar token={token} addbill={addbill} />
    {React.cloneElement(children, { token, addbill })}
    <BottomNavbar />
  </>
);

// HomeScreen with Navbar
const HomeScreenWithNavbar = ({ token, billid, billData, items, addbill }) => (
  <WithNavbar token={token} addbill={addbill}>
    <HomeScreen token={token} billid={billid} billData={billData} items={items} />
  </WithNavbar>
);

// AddItems with Navbar
const AddItemsWithNavbar = ({ token }) => (
  <WithNavbar token={token}>
    <AddItems token={token} />
  </WithNavbar>
);

// Item with Navbar
const ProductWithNavbar = ({ token }) => (
  <WithNavbar token={token}>
    <Item token={token} />
  </WithNavbar>
);

// Dashboard with Navbar
const DashboardWithNavbar = ({ token }) => (
  <WithNavbar token={token}>
    <Dashboard token={token} />
  </WithNavbar>
);

export default App;
