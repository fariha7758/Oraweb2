// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const templatesRoute = require('./routes/templates'); // Import templates route
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });
require('dotenv').config();

const app = express();


// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', require('./routes/auth'));        // For authentication routes
app.use('/templates', require('./routes/templates')); // For template-related routes
app.use('/api/templates', templatesRoute); // Use templates route for /api/templates


// Database connection and server start
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
  .catch((error) => console.log(error));

  wss.on('connection', ws => {
    ws.on('message', message => {
      // Broadcast received message to all connected clients
      wss.clients.forEach(client => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    });
  });
