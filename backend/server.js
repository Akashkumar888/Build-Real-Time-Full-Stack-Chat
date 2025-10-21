import 'dotenv/config';
import http from 'http';
import app from './app.js';
import connectDB from './configs/db.config.js';
import { initSocket } from './configs/socket.config.js';

// Connect to MongoDB
connectDB();

// Create HTTP server for Express + Socket.IO
const server = http.createServer(app);

// Initialize Socket.IO
export const { io, userSocketMap } = initSocket(server);

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});



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