import React, { useState, useEffect, useRef } from 'react';
import './HomeScreen.css';
import axios from 'axios';
import Modal from 'react-modal';
import ReactToPrint from 'react-to-print';
import { FaEdit, FaTrash } from 'react-icons/fa';

Modal.setAppElement('#root');

const HomeScreen = ({ token, billid }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [billdata, setBillData] = useState({
    id: '',
    bill_no: '',
    bill_name: '',
    create_datetime: ''
  });
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [initialQuantity, setInitialQuantity] = useState(1); // For editing

  const apiurl = process.env.REACT_APP_API_BASE_URL;
  const componentRef = useRef();

  const handleChange = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value === '') {
      setFilteredItems([]);
    } else {
      const filtered = items.filter((item) =>
        item.itemname.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setFilteredItems(filtered);
    }
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

    getBill();
    fetchItems();
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'p') {
        event.preventDefault();
        handlePrint();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [billid, token]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchQuery('');
  };

  const handleItemClick = (item) => {
    if (item.stock > 0) {
      setCurrentItem(item);
      setIsAddModalOpen(true);
    } else {
      alert('Item is out of stock');
    }
  };


  const handleAddItem = () => {
    if (currentItem) {
      const existingItem = selectedItems.find((item) => item.id === currentItem.id);
      if (!existingItem) {
        if (quantity > currentItem.stock) {
          alert('Selected quantity exceeds available stock.');
        } else {
          setSelectedItems((prevItems) => [
            ...prevItems,
            { ...currentItem, quantity: parseInt(quantity, 10) }
          ]);
          setIsAddModalOpen(false);
          setCurrentItem(null);
          setQuantity(1);
          
        }
      } else {
        if ((existingItem.quantity + parseInt(quantity, 10)) > currentItem.stock) {
          alert('Selected quantity exceeds available stock.');
        } else {
          setSelectedItems((prevItems) =>
            prevItems.map((item) =>
              item.id === currentItem.id
                ? { ...item, quantity: item.quantity + parseInt(quantity, 10) }
                : item
            )
          );
          setIsAddModalOpen(false);
          setCurrentItem(null);
          setQuantity(1);
        
        }
      }
    }
  };

  const handleEditItemClick = (index) => {
    const item = selectedItems[index];
    if (item.stock > 0) {
      setCurrentItem(item);
      setQuantity(item.quantity);
      setIsEditModalOpen(true);
    } else {
      alert('Item is out of stock');
    }
  };
  const handleSaveEdit = () => {
    if (currentItem) {
      const totalQuantity = selectedItems.find((item) => item.id === currentItem.id).quantity + parseInt(quantity, 10);
      if (totalQuantity > currentItem.stock) {
        alert('Selected quantity exceeds available stock.');
      } else {
        setSelectedItems((prevItems) =>
          prevItems.map((item, index) =>
            index === selectedItems.indexOf(currentItem)
              ? { ...item, quantity: totalQuantity }
              : item
          )
        );
        setIsEditModalOpen(false);
        setCurrentItem(null);
        setQuantity(1);
      }
    }
  };

  const handleDeleteItem = (index) => {
    setSelectedItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  const calculateTotalAmount = () => {
    return selectedItems.reduce((total, item) => total + item.price * item.quantity * (1 + item.gst / 100), 0);
  };
  

  const sendbilltodatabase = async () => {
    try {
      await Promise.all(
        selectedItems.map(async (item) => {
          const response = await axios.post(
            `${apiurl}api/bill-list/bill-list`,
            {
              billNoId: billdata.id,
              itemId: item.id,
              quantity: item.quantity,
              price: item.price,
              gst: item.gst
            },
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
          console.log('Bill sent successfully:', response.data);
        })
      );
    } catch (error) {
      console.error('Error sending bill to database:', error.message);
    }
  };

  const PrintComponent = React.forwardRef((props, ref) => (
    <div ref={ref} className='print-component'>
      <h1>Selected Items</h1>
      <h1>BIllNO : {billdata.bill_no}</h1>
      <h1>BillNAME : {billdata.bill_name}</h1>
      <table>
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {selectedItems.map(item => (
            <tr key={item.id}>
              <td>{item.itemname}</td>
              <td>{item.price}</td>
              <td>{item.category}</td>
              <td>{item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Total Amount: ${calculateTotalAmount()}</h3>

     </div>
  ));

  const handlePrint = () => {
    sendbilltodatabase();
  };

  return (
    <>
      <div className='homescreen'>
        <div className='homescreenHead'>
          <h2> Bill id : {billdata.bill_no}</h2>
          <h2>Name {billdata.bill_name}</h2>
        </div>
        <div className='search-container'>
          <form onSubmit={handleSubmit}>
            <input
              type='text'
              placeholder='Search...'
              value={searchQuery}
              onChange={handleChange}
            />
            <button type='submit'>Search</button>
          </form>
        </div>
        <div className='items-container'>
          {filteredItems.map((item) => (
            <div key={item.id} className='item-card' onClick={() => handleItemClick(item)}>
              <h3>{item.itemname}</h3>
              <p>Price: {item.price}</p>
              <p>Stock: {item.stock === 0 ? 'Item is out of stock' : item.stock}</p>
              <p>Category: {item.category}</p>
            </div>
          ))}
        </div>
      </div>
      <div className='printbutton'>
        <ReactToPrint
          trigger={() => <button className='Print'>Print Receipt</button>}
          content={() => componentRef.current}
          onAfterPrint={handlePrint}
        />
      </div>
      <div className='selected-items-container'>
        <h3>Selected Items</h3>
        <div className='mainfrom'>
          <div className='fromhead'>
            <h4>Bill No : {billdata.bill_no}</h4>
            <h4>Bill Name : {billdata.bill_name}</h4>
            <h4>Time: {billdata.create_datetime}</h4>
          </div>
          {selectedItems.map((item, index) => (
            <div key={index} className='selected-item-card'>
              <h3>{item.itemname}</h3>
              <p>Price: {item.price}</p>
              <p>Category: {item.category}</p>
              <p>Quantity: {item.quantity}</p>
              <div className='item-actions'>
                <FaEdit className='edit-icon' onClick={() => handleEditItemClick(index)} />
                <FaTrash className='delete-icon' onClick={() => handleDeleteItem(index)} />
              </div>
            </div>
          ))}
        </div>
        <div className='total-amount'>
          <h3>Total Amount: {calculateTotalAmount()}</h3>
        </div>
      </div>
      <Modal
        isOpen={isAddModalOpen}
        onRequestClose={() => setIsAddModalOpen(false)}
        contentLabel="Add Quantity Modal"
        className="quantity-modal"
        overlayClassName="modal-overlay"
      >
        <h2>Enter Quantity for {currentItem && currentItem.itemname}</h2>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          min="1"
        />
        <button onClick={handleAddItem}>Add</button>
        <button onClick={() => setIsAddModalOpen(false)}>Cancel</button>
      </Modal>
      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={() => setIsEditModalOpen(false)}
        contentLabel="Edit Quantity Modal"
        className="quantity-modal"
        overlayClassName="modal-overlay"
      >
        <h2>Edit Quantity for {currentItem && currentItem.itemname}</h2>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          min="1"
        />
        <button onClick={handleSaveEdit}>Save Edit</button>
        <button onClick={() => setIsEditModalOpen(false)}>Cancel</button>
      </Modal>
      <div style={{ display: "none" }}>
        <PrintComponent ref={componentRef} />
      </div>
    </>
  );
};

export default HomeScreen;