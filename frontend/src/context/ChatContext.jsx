
import { createContext, useContext, useEffect, useState } from "react";
import AppContext from "./AppContext";
import { toast } from "react-toastify";
import api from "../api/axios";

const ChatContext=createContext();

export const ChatContextProvider=({children})=>{

const [messages,setMessages]=useState([]);
const [users,setUsers]=useState([]);
const [selectedUser,setSelectedUser]=useState(null);
const [unseenMessages,setUnseenMessages]=useState(null);

const {socket}=useContext(AppContext);

// functions to get all users for sidebar
const getUsers=async()=>{
  try {
    const {data}=await api.get(`/api/messages/users`);
    if(data.success){
      setUsers(data.filteredUsers); // ✅ corrected key
      setUnseenMessages(data.unseenMessages || {}); // ✅ prevent null
    }
    else{
      toast.error(data.message);
    }
  } catch (error) {
    console.log(error);
    toast.error(error.message);
  }
}

// function to get messages for seleceted user
const getMessages=async(userId)=>{
  try {
    const {data}=await api.get(`/api/messages/${userId}`);
    if(data.success){
      setMessages(data.messages); // ✅ Corrected key
    }
  } catch (error) {
    console.log(error);
    toast.error(error.message);
  }
}

// function to send message to selected user
const sendMessage=async(messageData)=>{
  try {
    const {data}=await api.post(`/api/messages/send/${selectedUser._id}`,messageData);
    if(data.success){
    setMessages((prevMessages)=>[...prevMessages,data.newMessage])
    }
    else{
      toast.error(data.message);
    }
  } catch (error) {
    console.log(error);
    toast.error(error.message);
  }
}

// function to subscribe to messages for selected user
const subscribeToMessages=async()=>{
  if(!socket)return;
  
  socket.on("newMessage",(newMessage)=>{
    if(selectedUser && newMessage.senderId === selectedUser._id){
      newMessage.seen=true;
      setMessages((prevMessages)=>[...prevMessages,newMessage]);
      api.put(`/api/messages/mark/${newMessage._id}`);
    }
    else{
      setUnseenMessages((prevUnseenMessages)=>({
        ...prevUnseenMessages, [newMessage.senderId] : prevUnseenMessages[newMessage.senderId] ? prevUnseenMessages[newMessage.senderId] + 1  : 1
      }))
    }
  })
}


// function to unsubscribe from messages
const unsubscribeFromMessages=async()=>{
  if(socket)socket.off("newMessage");
}

useEffect(()=>{
  subscribeToMessages();
  return ()=> unsubscribeFromMessages();
},[socket,selectedUser]);

  const value={
   messages,
   getMessages,
   users,
   selectedUser,
   getUsers,
   setMessages,
   sendMessage,
   setSelectedUser,
   unseenMessages,
   setUnseenMessages
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  )
}

export default ChatContext;