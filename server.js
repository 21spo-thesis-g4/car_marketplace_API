const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 4000; // You can change the port if needed

// Middleware
app.use(cors({
    origin: 'http://localhost:3000' // Allow requests from the React app
  }));
  
app.use(bodyParser.json());

// Simulated database (in-memory storage for items)
let items = [
    { id: 1, name: 'Item 1', description: 'Description of Item 1' },
    { id: 2, name: 'Item 2', description: 'Description of Item 2' }
];
let idCounter = 1;

// Routes

// CREATE (POST /items)
app.post('/items', (req, res) => {
  const { name, description } = req.body;
  if (!name || !description) {
    return res.status(400).json({ message: 'Name and description are required' });
  }
  const newItem = { id: idCounter++, name, description };
  items.push(newItem);
  res.status(201).json(newItem);
});

// API Routes
app.get('/items', (req, res) => {
    
    res.json(items);
  });

// READ ONE (GET /items/:id)
app.get('/items/:id', (req, res) => {
  const item = items.find(i => i.id === parseInt(req.params.id));
  if (!item) {
    return res.status(404).json({ message: 'Item not found' });
  }
  res.json(item);
});

// DELETE - DELETE /items/:id
app.delete('/items/:id', (req, res) => {
    const itemId = parseInt(req.params.id);
    const itemIndex = items.findIndex(i => i.id === itemId);
  
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found' });
    }
  
    // Remove the item from the array
    items.splice(itemIndex, 1);
    res.status(204).send();  // Send a 204 No Content response
  });
  
  

// Start Server
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
