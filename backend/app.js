import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import connectDB from './configs/db.config.js';
import userRouter from './routes/user.route.js';
import messageRouter from './routes/message.routes.js';
// ------------------- DB CONNECT -------------------

connectDB();

// ------------------- EXPRESS APP -------------------
const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Routes
app.get('/', (req, res) => res.send('Server is working'));
app.use('/api/user', userRouter); 
app.use('/api/messages', messageRouter);

// ------------------- HTTP SERVER -------------------
const server = http.createServer(app);



// Initialize socket.io server 
export const io = new Server(server, {
  cors: { origin: "*" }
});

// store online users 
// ------------------- SOCKET.IO CONFIG -------------------
export const userSocketMap = {}; // {userId: socketId}


// SOCKET CONNECTION
// Listen for incoming socket connections
 io.on('connection', (socket) => { // userId should be sent from client when connecting via query params 
  const userId = socket.handshake.query.userId; 
  if (!userId) return; 
  // If no userId provided, ignore this connection 
  console.log('User Connected:', userId);
  //  // Store socket.id for this user 
  if(userId)userSocketMap[userId] = socket.id; 
  // Broadcast the current list of online users to all clients 
  // emit online users to all connected clients 
  io.emit('getOnlineUsers', Object.keys(userSocketMap)); 
  // // Listen for disconnect event 
  socket.on('disconnect', () => { 
    console.log('User Disconnected:', userId); // Remove user from online users map 
   delete userSocketMap[userId]; // Broadcast updated online users list 
   io.emit('getOnlineUsers', Object.keys(userSocketMap)); 
  }); 
});


// ------------------- START SERVER -------------------
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});






// 🧠 How They Work Together (for Chat + Video Calls)
// Let’s say you’re building WhatsApp in MERN:
// Chat (text messages)
// Use Socket.IO to emit and listen for events like:
// "send_message"
// "receive_message"
// "typing"
// It updates both users’ UIs instantly without page reload.
// Video/Voice Call
// Use WebRTC for direct browser-to-browser connection.
// Use Socket.IO as the signaling channel to exchange WebRTC offer/answer and ICE candidates.
// Media stream (audio/video) goes directly between peers, not through your Node server.
// Database (MongoDB)
// Store chat messages, call history, and user info.

// Use Case	                         Technology
// Real-time text chat	             Socket.IO
// Real-time notifications	         Socket.IO
// Video/Voice calls	               WebRTC
// Signaling for WebRTC	             Socket.IO
// Data storage	                     MongoDB

// 💬 Real-Time Communication Technologies
// Here’s a full list of industry-used technologies for chat, voice, and video communication systems:

// Category	Technology	Purpose / Use Case	Notes
// 🔌 Real-time Transport (Low Latency)	WebSockets	Bi-directional, full-duplex communication between browser and server	Best for chat apps, notifications, real-time dashboards
// 	Socket.IO	Library built on top of WebSockets (adds auto-reconnect, rooms, events, fallbacks)	✅ Most common in MERN-stack chat apps
// 	SignalR (Microsoft)	Real-time communication for .NET apps	Used in enterprise apps
// 	STOMP over WebSocket	Protocol for message brokers like RabbitMQ or ActiveMQ	Used in scalable chat servers
// 	MQTT	Lightweight publish-subscribe protocol	Common in IoT and mobile chat
// 🎥 Peer-to-Peer Communication	WebRTC (Web Real-Time Communication)	Enables browser-to-browser audio/video/data transfer	Used for video calling and screen sharing
// 	RTCPeerConnection	WebRTC API for managing peer connections	Handles ICE, STUN/TURN, etc.
// 	DataChannel	WebRTC feature for sending data directly between peers	Low-latency game or file sharing
// 📡 Signaling Layer (used with WebRTC)	Socket.IO / WebSockets / Firebase RTDB / PeerJS	Used to exchange metadata (SDP, ICE) before peers connect	WebRTC itself needs a signaling channel
// 📦 Media Streaming Protocols	RTMP (Real-Time Messaging Protocol)	Used for streaming (YouTube Live, Twitch ingest)	Not peer-to-peer
// 	HLS (HTTP Live Streaming)	Apple’s streaming format, higher latency	Used for broadcasting (not for calls)
// 	DASH (Dynamic Adaptive Streaming over HTTP)	Similar to HLS, adaptive bitrate streaming	Used in Netflix/YouTube playback
// 🧠 Frameworks / Libraries	PeerJS	Simplifies WebRTC peer connections	Great for quick video chat demos
// 	SimpleWebRTC	Wrapper around WebRTC for easier integration	Good for group calls
// 	Twilio / Agora / Daily.co / 100ms / Jitsi SDK	Third-party SDKs providing signaling + TURN/STUN + media servers	Used in production video-call apps
// 	Mediasoup / Janus / Kurento	Self-hosted SFU/MCU media servers	Used in enterprise multi-party video systems
// 🛰️ Messaging / Queue Systems	Redis Pub/Sub	Real-time event broadcasting	Used with Socket.IO clusters
// 	Kafka / RabbitMQ	Message brokers for scalable real-time processing	Used in backend microservices
// 🔧 Typical Stack for Each Use-Case
// Use-Case	Common Tech Stack
// 💬 1-to-1 Chat App	MERN + Socket.IO
// 👥 Group Chat	MERN + Socket.IO + Redis (for scaling)
// 🎥 Video Calling	WebRTC + Socket.IO (for signaling) + STUN/TURN servers
// 📹 Live Streaming	RTMP + HLS/DASH + Media server (NGINX-RTMP, Wowza, Ant Media)
// 📊 Real-time Dashboard	Node.js + WebSockets / Socket.IO
// 📱 IoT Communication	MQTT + WebSockets