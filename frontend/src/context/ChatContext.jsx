
import { createContext, useContext, useState } from "react";
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
      setUsers(data.users);
      setUnseenMessages(data.unseenMessages);
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
      setMessages(data.message);
    }
  } catch (error) {
    console.log(error);
    toast.error(error.message);
  }
}



  const value={

  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  )
}

export default ChatContext;