
import { Server } from 'socket.io';
import app from '../app.js';
import http from 'http';
const server = http.createServer(app);

export const initSocket = (server) => {
  // Create a new Socket.IO server instance
  const io = new Server(server, {
    cors: { origin: '*' }, // Allow connections from any origin (for development / testing)
  });

  const userSocketMap = {}; 
  // This object stores mapping of userId to their socketId
  // Example: { 'userId1': 'socketId1', 'userId2': 'socketId2' }

  // Listen for incoming socket connections
  io.on('connection', (socket) => {
    // Extract userId sent by client in handshake query
    const userId = socket.handshake.query.userId;
    console.log('User Connected:', userId);

    // Store socketId for the connected user
    if (userId) userSocketMap[userId] = socket.id;


// getOnlineUsers is the name of the Socket.IO event you are emitting.
// It sends the current list of online users to all connected clients.

    // Emit current list of online users to all connected clients
    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    // Listen for disconnection
    socket.on('disconnect', () => {
      console.log('User Disconnected:', userId);
      // Remove user from online users map
      delete userSocketMap[userId];
      // Update all clients with new online users list
      io.emit('getOnlineUsers', Object.keys(userSocketMap));
    });
  });

  // Return both the io instance and the online user map
  return { io, userSocketMap };
};
