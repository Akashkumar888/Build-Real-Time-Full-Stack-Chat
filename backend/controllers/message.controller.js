import cloudinary from "../configs/cloudinary.config.js";
import messageModel from "../models/message.model.js";
import userModel from "../models/user.model.js";
import { io,userSocketMap } from "../server.js";


// Get all users for sidebar except the logged-in user
export const getUsersForSidebar = async (req, res) => {
  try {
    const userId = req.user._id; // ID of currently logged-in user (from auth middleware)

    // Fetch all users except the logged-in one
    const filteredUsers = await userModel.find({
      _id: { $ne: userId }, // $ne = "not equal"
    });

    // Object to store count of unseen messages for each user
    const unseenMessages = {};

    // For each user, check how many messages are sent to the logged-in user but not seen
    const promises = filteredUsers.map(async (user) => {
      const messages = await messageModel.find({
        senderId: user._id,
        receiverId: userId,
        seen: false, // only messages not seen by logged-in user
      });

      if (messages.length > 0) {
        unseenMessages[user._id] = messages.length; // store count of unseen messages
      }
    });

    await Promise.all(promises); // wait for all queries to finish

    // Send response
    res.status(200).json({ success: true, filteredUsers, unseenMessages });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
}


// Controller to get all messages between the logged-in user and a selected user
export const getMessages = async (req, res) => {
  try {
    // Extract the selected user's ID from the URL parameters
    const { id: selectedUserId } = req.params; 
       // is destructuring the id from req.params. It’s equivalent to:
    // const id = req.params.id;
    // Both work the same way. You can use either style depending on your preference.

    // ID of the currently logged-in user (from auth middleware)
    const myId = req.user._id;

    const page = parseInt(req.query.page) || 1;   // default page 1
    const limit = parseInt(req.query.limit) || 20; // default 20 messages per page
    const skip = (page - 1) * limit;


    // Fetch all messages between the logged-in user and the selected user
    const messages = await messageModel.find({
      $or: [  // MongoDB OR condition
        { senderId: myId, receiverId: selectedUserId }, // messages sent by me to the selected user
        { senderId: selectedUserId, receiverId: myId }  // messages sent by selected user to me
      ]
    }).sort({ createdAt: 1 }) // latest messages first
    .skip(skip)
    .limit(limit);
    // Now `messages` contains all messages exchanged between these two users
//     .sort({ createdAt: 1 }) // oldest → newest
// Now messages will come in chronological order (top to bottom).

    // Mark all messages sent by the selected user to the logged-in user as 'seen'
    await messageModel.updateMany(
      { senderId: selectedUserId, receiverId: myId }, 
      { seen: true }
    );

    // Send response with the messages
    res.status(200).json({ success: true, messages });

  } catch (error) {
    console.log(error);
    // Send error response if something goes wrong
    res.status(500).json({ success: false, message: error.message });
  }
}


// req.params.id
// Gets the id of the message from the URL (e.g., /messages/123/seen → id = 123).
// Controller to mark a specific message as "seen" using its ID
export const markMessageAsSeen = async (req, res) => {
  try {
    // Extract the message ID from the URL parameters
    const { id } = req.params;  
    // is destructuring the id from req.params. It’s equivalent to:
    // const id = req.params.id;
    // Both work the same way. You can use either style depending on your preference.

    // Find the message by its ID and update the 'seen' field to true
    // This marks that the recipient has viewed the message
    await messageModel.findByIdAndUpdate(id, { seen: true });

    // Send a success response back to the client
    res.status(200).json({ success: true });

  } catch (error) {
    // Log any errors for debugging
    console.log(error);

    // Send error response if something goes wrong
    res.status(500).json({ success: false, message: error.message });
  }
}


// API to send a message to a selected user
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;       // Get message text and optional image from request body
    const receiverId = req.params.id;       // Get the ID of the receiver from the URL parameters
    const senderId = req.user._id;          // Get the sender's ID from the authenticated user (set by auth middleware)

    // 1️⃣ Validation
    if (!receiverId) {
      return res.status(400).json({ success: false, message: "Receiver ID is required" });
    }
    if (!text && !image) {
      return res.status(400).json({ success: false, message: "Message text or image is required" });
    }

    let imageUrl;                            // Variable to store Cloudinary image URL
    if (image) {
      // If an image is sent, upload it to Cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url; // Get the URL of the uploaded image
    }

    // Create a new message document in MongoDB
    const newMessage = await messageModel.create({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    // Emit the new message to the receiver if they are online
    const receiverSocketId = userSocketMap[receiverId]; // Get receiver's socketId from the online users map
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
      // Send the message in real-time via Socket.IO to only the receiver
    }

    // Send the created message as a response to the sender
    res.status(200).json({ success: true, newMessage });

  } catch (error) {
    console.log(error);
    // Send error response if something goes wrong
    res.status(500).json({ success: false, message: error.message });
  }
};


// Minor Suggestions / Industry Improvements
// Validation: You could validate text and receiverId before processing.
// Pagination for messages: getMessages may return a lot of messages if chat is long. Using .limit() and .skip() could help.
// Consistent naming: filteredUsers and unseenMessages are clear, keep consistent naming across other controllers.