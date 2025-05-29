import React, { useState } from 'react';
import axios from 'axios';
import { API_CONFIG } from './config';

const MakeupTryOn = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState("lipstick");
  const [color, setColor] = useState("255,0,0");
  const [processedImage, setProcessedImage] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleProductChange = (event) => {
    setSelectedProduct(event.target.value);
  };

  const handleColorChange = (event) => {
    setColor(event.target.value);
  };

  const handleApplyMakeup = async () => {
    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("product", selectedProduct);
    formData.append("color", color);

    try {
      const response = await axios.post(`${API_CONFIG.MAKEUP_API_URL}/apply_makeup/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProcessedImage(response.data.image);
    } catch (error) {
      console.error("Error applying makeup:", error);
    }
  };

  return (
    <div>
      <h2>Virtual Makeup Try-On</h2>

      <input type="file" onChange={handleFileChange} />
      
      <label>
        Product:
        <select value={selectedProduct} onChange={handleProductChange}>
          <option value="lipstick">Lipstick</option>
          <option value="blush">Blush</option>
          <option value="foundation">Foundation</option>
        </select>
      </label>

      <label>
        Color (RGB):
        <input type="text" value={color} onChange={handleColorChange} placeholder="255,0,0" />
      </label>

      <button onClick={handleApplyMakeup}>Apply Makeup</button>

      {processedImage && (
        <div>
          <h3>Processed Image:</h3>
          <img src={`data:image/png;base64,${processedImage}`} alt="Processed" />
        </div>
      )}
    </div>
  );
};

export default MakeupTryOn;
