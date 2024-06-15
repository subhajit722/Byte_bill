import React, { useEffect } from 'react';
import { FaHome, FaPlus, FaList, FaChartBar } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Assuming you're using React Router
import './BottomNavbar.css'

const useKeyboardNavigation = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case '!':
          navigate('/home');
          break;
        case '@':
          navigate('/additems');
          break;
        case '#':
          navigate('/items');
          break;
        case '$':
          navigate('/dashboard');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate]);
};

const BottomNavbar = () => {
  useKeyboardNavigation();

  const location = useLocation();
  return (
    <nav className="bottom-navbar">
    <Link to="/home" className={`nav-link ${location.pathname === '/home' ? 'active' : ''}`}>
      <FaHome />
      <span>Home Screen</span>
    </Link>
    <Link to="/additems" className={`nav-link ${location.pathname === '/additems' ? 'active' : ''}`}>
      <FaPlus />
      <span>Add Items</span>
    </Link>
    <Link to="/items" className={`nav-link ${location.pathname === '/items' ? 'active' : ''}`}>
      <FaList />
      <span>Items</span>
    </Link>
    <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>
      <FaChartBar />
      <span>Dashboard</span>
    </Link>
  </nav>
  );
};

export default BottomNavbar;
