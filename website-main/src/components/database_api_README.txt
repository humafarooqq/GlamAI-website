# Minimal MongoDB API Setup for Read-Only Access

This guide explains which files you need to set up a minimal Node.js/Express API to read data from a MongoDB database, and how to use them. This is useful if you want to create a new project or chat that only needs to fetch data (not add or modify it).

## 1. Required Files

### .env
- Stores your MongoDB connection string and environment variables.
- Example:
  ```
  MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
  PORT=5000
  ```

### package.json
- Lists your project dependencies.
- Minimal dependencies for read-only API:
  ```json
  {
    "dependencies": {
      "express": "^4.18.2",
      "mongoose": "^7.0.3",
      "dotenv": "^16.0.3",
      "cors": "^2.8.5"
    }
  }
  ```

### server.js
- Main entry point for your Express server.
- Connects to MongoDB and sets up API routes.
- Example skeleton:
  ```js
  require('dotenv').config();
  const express = require('express');
  const mongoose = require('mongoose');
  const cors = require('cors');

  const app = express();
  app.use(cors());
  app.use(express.json());

  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

  app.use('/api/products', require('./routes/products'));

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  ```

### models/Product.js
- Mongoose schema/model for your products.
- Example:
  ```js
  const mongoose = require('mongoose');
  const productSchema = new mongoose.Schema({
    name: String,
    category: String,
    brand: String,
    description: String,
    mainImage: String, // or ObjectId if using GridFS
    shades: [
      {
        name: String,
        colorCode: String,
        referenceImage: String, // or ObjectId
        price: Number,
        stock: Number
      }
    ]
  });
  module.exports = mongoose.model('Product', productSchema);
  ```

### routes/products.js
- Express router for product endpoints.
- Example (read-only):
  ```js
  const express = require('express');
  const router = express.Router();
  const Product = require('../models/Product');

  // Get all products
  router.get('/', async (req, res) => {
    try {
      const products = await Product.find();
      res.json(products);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // Get single product by ID
  router.get('/:id', async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).json({ message: 'Product not found' });
      res.json(product);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  module.exports = router;
  ```

## 2. How a New AI/Chat Can Use This
- **Start the server**: `node server.js` (or `npm run dev` if using nodemon)
- **API Endpoints**:
  - `GET /api/products` — returns all products
  - `GET /api/products/:id` — returns a single product by ID
- **No authentication or write access**: This setup is read-only and safe for public or internal use.
- **Extend as needed**: You can add more models/routes for other collections (e.g., users, orders) using the same pattern.

## 3. Not Included
- File upload (GridFS)
- Authentication
- Admin/product management features
- Any write (POST/PUT/DELETE) endpoints

---

**Summary:**
- Use `.env`, `package.json`, `server.js`, `models/Product.js`, and `routes/products.js` for a minimal, read-only MongoDB API.
- This is all you need for a new project or chat to fetch product data from your database. 