
import 'dotenv/config'
import express from 'express'
import userRouter from './routes/user.route.js';
import connectDB from './configs/db.config.js';
const app=express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// database connection
connectDB();


// test API
app.get("/",(req,res)=>{
  res.send("Server is working.");
})
// test API for users
app.use("/api/user",userRouter);


export default app;

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
