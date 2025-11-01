// import { Server } from 'socket.io';

// export const initSocket = (server) => {
//   // Create a new Socket.IO server instance
//   // CORS is configured to allow all origins (for dev; restrict in production)
//   const io = new Server(server, {
//     cors: { origin: '*' },
//   });

//   // Object to store online users
//   // Key: userId, Value: socket.id
//   const userSocketMap = {};

//   // Listen for incoming socket connections
//   io.on('connection', (socket) => {
//     // userId should be sent from client when connecting via query params
//     const userId = socket.handshake.query.userId;

//     // If no userId provided, ignore this connection
//     if (!userId) return;

//     console.log('User Connected:', userId);

//     // Store socket.id for this user
//     userSocketMap[userId] = socket.id;

//     // Broadcast the current list of online users to all clients
//     io.emit('getOnlineUsers', Object.keys(userSocketMap));

//     // Listen for disconnect event
//     socket.on('disconnect', () => {
//       console.log('User Disconnected:', userId);

//       // Remove user from online users map
//       delete userSocketMap[userId];

//       // Broadcast updated online users list
//       io.emit('getOnlineUsers', Object.keys(userSocketMap));
//     });
//   });

//   // Return io instance and user map for use in other modules
//   return { io, userSocketMap };
// };
