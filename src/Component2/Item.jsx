import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import './Items.css';
import { FaEdit, FaTrash } from 'react-icons/fa';

Modal.setAppElement('#root'); // Important for accessibility

const Item = ({ token }) => {
  const [items, setItems] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [itemDetails, setItemDetails] = useState({
    itemname: '',
    itemcode: '',
    category: '',
    price: '',
    gst: '',
    totalprice: '',
    stock: ''
  });

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

  useEffect(() => {
    if (token) {
      fetchItems();
    }
  }, [token, apiurl]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiurl}api/item/items/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting item:', error.message);
    }
  };

  const handleEdit = (item) => {
    setIsEditing(true);
    setEditItem(item.id);
    setItemDetails({
      itemname: item.itemname,
      itemcode: item.itemcode,
      category: item.category,
      price: item.price,
      gst: item.gst,
      totalprice: item.totalprice,
      stock: item.stock
    });
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `${apiurl}api/item/items/${editItem}`,
        {
          itemname: itemDetails.itemname,
          category: itemDetails.category,
          price: itemDetails.price,
          gst: itemDetails.gst,
          itemcode: itemDetails.itemcode,
          stock: itemDetails.stock
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setItems(items.map(item => (item.id === editItem ? response.data : item)));
      setIsEditing(false);
      setEditItem(null);
      setItemDetails({
        itemname: "",
        itemcode: "",
        category: "",
        price: "",
        gst: "",
        stock: "",
        totalprice: ""
      });
      fetchItems();
    } catch (error) {
      console.error("Error updating item:", error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItemDetails(prevDetails => ({
      ...prevDetails,
      [name]: value
    }));
  };

  const closeModal = () => {
    setIsEditing(false);
    setEditItem(null);
    setItemDetails({
      itemname: '',
      itemcode: '',
      category: '',
      price: '',
      stock: '',
      gst: '',
      totalprice: ''
    });
  };

  return (
    <div className='allproduct'>
      <div className='header'>
        <h2>All Product</h2>
      </div>
      <div className='item-list'>
        {items.map((item) => (
          <div key={item.id} className='item'>
            <div className='item-details'>
              <h3>{item.itemname}</h3>
              <p>{item.itemcode}</p>
              <p>{item.category}</p>
              <p>Price: ${item.price}</p>
              <p>GST: ${item.gst}</p>
              <p>Stock: {item.stock === 0 ? 'Item is out of stock' : item.stock}</p>
              <p>Total: ${item.totalprice}</p>
              <div className='item-actions1'>
                <FaEdit className='edit-icon2' onClick={() => handleEdit(item)} />
                <FaTrash className='delete-icon2' onClick={() => handleDelete(item.id)} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <Modal
        isOpen={isEditing}
        onRequestClose={closeModal}
        contentLabel="Edit Item"
        className="modal"
        overlayClassName="overlay"
      >
        <h3>Edit Item</h3>
        <label>
          Item Name:
          <input type='text' name='itemname' value={itemDetails.itemname} onChange={handleChange} />
        </label>
        <label>
          Item Code:
          <input type='text' name='itemcode' value={itemDetails.itemcode} onChange={handleChange} />
        </label>
        <label>
          Category:
          <input type='text' name='category' value={itemDetails.category} onChange={handleChange} />
        </label>
        <label>
          Price:
          <input type='number' name='price' value={itemDetails.price} onChange={handleChange} />
        </label>
        <label>
          GST:
          <input type='number' name='gst' value={itemDetails.gst} onChange={handleChange} />
        </label>
        <label>
          Stock:
          <input type='number' name='stock' value={itemDetails.stock} onChange={handleChange} />
        </label>
        <label>
          Total Price:
          <input type='number' name='totalprice' value={itemDetails.totalprice} onChange={handleChange} />
        </label>
        <button onClick={handleUpdate}>Update Item</button>
        <button onClick={closeModal}>Cancel</button>
      </Modal>
    </div>
  );
};

export default Item;
