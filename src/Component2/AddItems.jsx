import React, { useState } from 'react';
import axios from 'axios';
import './AddItems.css';

const AddItems = ({ token }) => {
  const apiurl = process.env.REACT_APP_API_BASE_URL;

  const [itemData, setItemData] = useState({
    itemName: '',
    price: '',
    itemCode: '',
    categories: '',
    stock : '',
    gst: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItemData({ ...itemData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(token);
    try {
      const response = await axios.post(
        `${apiurl}api/item/items`,
        {
          itemname: itemData.itemName,
          category: itemData.categories,
          price: itemData.price,
          gst: itemData.gst,
          itemcode: itemData.itemCode,
          stock:parseInt(itemData.stock),
        },
        {
          headers: {
            Authorization: `Bearer ${token} `,
          },
        }
      );
      console.log('Item added successfully:', response.data);
      // Reset the form after successful submission
      setItemData({
        itemName: '',
        price: '',
        itemCode: '',
        categories: '',
        gst: '',
        stock : '',
      });
    } catch (error) {
      console.error('Error adding item:', error.message);
      // Handle error (e.g., display error message)
    }
  };
  

  return (
    
    <div className='form-container'>
      <h2>Add Items</h2>
      <div className='form-group'>
        <form onSubmit={handleSubmit}>
          <label htmlFor="itemName">Item Name:</label>
          <input
            type="text"
            id="itemName"
            name="itemName"
            value={itemData.itemName}
            onChange={handleChange}
          />

          <label htmlFor="price">Price:</label>
          <input
            type="number"
            id="price"
            name="price"
            value={itemData.price}
            onChange={handleChange}
          />

          <label htmlFor="itemCode">Item Code:</label>
          <input
            type="text"
            id="itemCode"
            name="itemCode"
            value={itemData.itemCode}
            onChange={handleChange}
          />

          <label htmlFor="categories">Categories:</label>
          <select
            id="categories"
            name="categories"
            value={itemData.categories}
            onChange={handleChange}
          >
            <option value="">Select a category</option>
            <option value="food">Food</option>
            <option value="clothing">Clothing</option>
            <option value="electronics">Electronics</option>
            <option value="game">Game</option>
          </select>

          <label htmlFor="gst">GST:</label>
          <input
            type="number"
            id="gst"
            name="gst"
            value={itemData.gst}
            onChange={handleChange}
          />
           <label htmlFor="stock">Stock:</label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={itemData.stock}
            onChange={handleChange}
          />

          <button type="submit">Add Item</button>
        </form>
      </div>
    </div>
  );
};

export default AddItems;
