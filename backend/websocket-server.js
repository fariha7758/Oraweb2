const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8081 });
console.log('WebSocket server running on ws://localhost:8081');

// Store clients by template ID
const clients = {};

wss.on('connection', (ws) => {
  let currentTemplateId = null;
  let userId = null;

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);

      switch (message.type) {
        case 'join_template':
          currentTemplateId = message.templateId;
          userId = message.userId;

          // Initialize the client set for this template if needed
          if (!clients[currentTemplateId]) {
            clients[currentTemplateId] = new Set();
          }
          clients[currentTemplateId].add(ws);

          console.log(`User ${userId} joined template ${currentTemplateId}. Active users: ${clients[currentTemplateId].size}`);

          // Notify all clients in the template about the new user
          broadcastToTemplate(currentTemplateId, {
            type: 'user_joined',
            userId: userId,
            activeUsers: clients[currentTemplateId].size,
          });
          break;

        case 'leave_template':
          handleUserLeavingTemplate();
          break;

        case 'update_template':
          // Broadcast updated template data to all clients in the template
          broadcastToTemplate(currentTemplateId, {
            type: 'update_template',
            droppedItems: message.droppedItems,
            userId: message.userId,
          }, ws); // Exclude sender
          break;

        default:
          console.error('Unknown message type:', message.type);
      }
    } catch (error) {
      console.error('Failed to process message:', error);
    }
  });

  ws.on('close', () => {
    handleUserLeavingTemplate();
  });

  // Function to handle when a user leaves a template or disconnects
  function handleUserLeavingTemplate() {
    if (currentTemplateId && clients[currentTemplateId]) {
      clients[currentTemplateId].delete(ws);

      if (clients[currentTemplateId].size > 0) {
        // Notify remaining users in the template about the user leaving
        broadcastToTemplate(currentTemplateId, {
          type: 'user_left',
          userId: userId,
          activeUsers: clients[currentTemplateId].size,
        });
      } else {
        // No more users in this template; clean up the template entry
        delete clients[currentTemplateId];
      }

      console.log(`User ${userId} left template ${currentTemplateId}. Active users: ${clients[currentTemplateId]?.size || 0}`);
    }
  }
});

// Broadcast helper function
function broadcastToTemplate(templateId, message, excludeClient = null) {
  if (clients[templateId]) {
    clients[templateId].forEach((client) => {
      if (client !== excludeClient && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }
}
