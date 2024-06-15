import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import axios from 'axios';
import moment from 'moment';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Dashboard = ({ token }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState([]);
  const [billNoId, setBillNoId] = useState(null);
  const [stockModel, setStockModel] = useState(false);
  const [items, setItems] = useState([]);
  const [recentOrder, setRecentOrder] = useState(false);
  const [totalSell, setTotalSell] = useState(null);
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
  const [sellToday, setSellToday] = useState(null);
  const [filter, setFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [activeCard, setActiveCard] = useState('totalSell');
  const apiurl = process.env.REACT_APP_API_BASE_URL;

  const fetchItems = async () => {
    try {
      const response = await axios.get(`${apiurl}api/item/items`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error.message);
    }
  };

  // useEffect(()=>{
  //   filterOrdersByDate()
  // },[selectedDate])
  const fetchTotalSell = async () => {
    try {
      const response = await axios.get(`${apiurl}api/sell/total`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTotalSell(response.data);
    } catch (error) {
      console.error('Error fetching total sell:', error.message);
    }
  };
  const filterOrdersByDate = (date) => {
    const selectedDate = moment.utc(date).startOf('day');
    console.log('Formatted selected date:', selectedDate.format());

    const filteredOrders = orders.filter(order => {
      const orderDate = moment.utc(order.create_datetime).startOf('day');
      console.log('Order date:', orderDate.format());
      return orderDate.isSame(selectedDate, 'day');
    });

    console.log('Filtered orders:', filteredOrders);
    setSellToday(filteredOrders);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    filterOrdersByDate(date);
  };

 

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${apiurl}api/bill/bills/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error.message);
    }
  };

  useEffect(() => {
    fetchItems();
    fetchOrders();
  }, [token]);

  useEffect(() => {
    if (activeCard === 'totalSell') {
      fetchTotalSell();
    } else if (activeCard === 'sellToday' && selectedDate) {
     filterOrdersByDate(selectedDate)
    } else if (activeCard === 'currentStock') {
      fetchItems();
    }
  }, [activeCard]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBill(null);
  };

  const handleBillClick = async (id) => {
    setBillNoId(id);
    try {
      const response = await axios.get(`${apiurl}api/bill-list/bill-list/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSelectedBill(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching bill details:', error.message);
    }
  };

  return (
    <div className="dashboard">
      <div className="cards">
        <div
          className={`card ${activeCard === 'totalSell' ? 'active' : ''}`}
          onClick={() => setActiveCard('totalSell')}
        >
          Total Sell
        </div>
        <div
          className={`card ${activeCard === 'sellToday' ? 'active' : ''}`}
          onClick={() => setActiveCard('sellToday')}
        >
          Sell Today
        </div>
        <div
          className={`card ${activeCard === 'currentStock' ? 'active' : ''}`}
          onClick={() => setActiveCard('currentStock')}
        >
          Current Stock
        </div>
      </div>
    

      {/* {activeCard === 'totalSell' && (
        <div className="order-summary">
          <h2>Total Sell</h2>
        </div>
      )} */}
     {activeCard === 'sellToday' && (
        <div className="order-summary">
          <h2>Sell Today</h2>
          <div className="search-area">
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
          />
          </div>
          {sellToday > 0 ? (
            sellToday.map((order) => (
              <div
                key={order.id}
                className="order-item"
                onClick={() => handleBillClick(order.id)}
              >
                <p>
                  <strong>Bill Name:</strong> {order.bill_name}
                </p>
                <p>
                  <strong>Bill No:</strong> {order.bill_no}
                </p>
                <p>
                  <strong>Bill id:</strong> {order.id}
                </p>
                <p>
                  <strong>Date:</strong>{' '}
                  {moment(order.create_datetime).format('MMMM DD, YYYY')}
                </p>
              </div>
            ))
          ) : (
            <p>No orders for the selected date.</p>
          )}
        </div>
      )}

      {activeCard === 'currentStock' && (
        <div className="order-summary">
          <h2>Items Stock</h2>
          {items.map((item) => (
            <div key={item.id} className="order-item">
              <p>
                <strong>Item Name:</strong> {item.itemname}
              </p>
              <p>
                <strong>Stock No:</strong> {item.stock}
              </p>
            </div>
          ))}
        </div>
      )}
  {activeCard === 'totalSell' && (
        <div className="order-summary">
          <h2>Order Summary</h2>
          {orders.map((order) => (
            <div
              key={order.id}
              className="order-item"
              onClick={() => handleBillClick(order.id)}
            >
              <p>
                <strong>Bill Name:</strong> {order.bill_name}
              </p>
              <p>
                <strong>Bill No:</strong> {order.bill_no}
              </p>
              <p>
                <strong>Bill id:</strong> {order.id}
              </p>
              <p>
                <strong>Date:</strong>{order.create_datetime}
              </p>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Bill Details"
        className="modal2"
        overlayClassName="modal-overlay2"
      >
        {selectedBill ? (
          <div className="bill-detail2">
            <h2>Bill Details</h2>
            <p>
              <strong>Bill No:</strong> {selectedBill[0]?.billlist_id}
            </p>
            <h3>Bill Items</h3>
            <ul className="ulclass">
              {selectedBill.map((item, index) => (
                <li key={index}>
                  {item.itemname} - category: {item.category} - quantity:{' '}
                  {item.quantity} - ${item.price} - gst: {item.gst}
                </li>
              ))}
            </ul>
            <p>
              <strong>Total Price:</strong> $
              {selectedBill
                .reduce(
                  (total, item) =>
                    total +
                    item.price * item.quantity * (1 + item.gst / 100),
                  0
                )
                .toFixed(2)}
            </p>
            <button onClick={closeModal}>Close</button>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </Modal>
    </div>
  );
};

export default Dashboard;
