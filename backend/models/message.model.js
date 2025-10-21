import mongoose from "mongoose";

// Define the schema for messages
const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the user who sent the message
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the user who receives the message
  text: { type: String },   // Message text (optional)
  image: { type: String },  // URL of an image in the message (optional)
  seen: { type: Boolean, default: false }, // Whether the receiver has seen the message
}, { timestamps: true });   // Automatically adds createdAt and updatedAt fields

// Create the Mongoose model. If already exists, use it; otherwise, create new.
const messageModel = mongoose.models.Message || mongoose.model("Message", messageSchema);

export default messageModel;
