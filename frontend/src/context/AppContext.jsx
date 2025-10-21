
import { useState } from "react";
import { createContext } from "react";
import { toast } from "react-toastify";
import api from "../api/axios";
import { useEffect } from "react";
import {io} from 'socket.io-client'


const AppContext=createContext();


export const AppContextProvider=({children})=>{

  const [token,setToken]=useState(localStorage.getItem("token") || "");
  const [authUser,setAuthUser]=useState(null);
  const [onlineUsers,setOnlineUsers]=useState([]);
  const [socket,setSocket]=useState(null);


// connect socket functions to handle socket connections and online users updates
const connectSocket=(userData)=>{
  if(!userData || socket?.connected) return ;
  const newSocket=io(import.meta.env.VITE_BACKEND_URL,{
   query:{
    userId:userData._id
   }
  });
  newSocket.connect();
  setSocket(newSocket);
  newSocket.on("getOnlineUsers",(userIds)=>{
    setOnlineUsers(userIds);
  })

  // 🔒 Optional: Handle disconnect automatically on unmount
    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

}

// check if user is autheticated and if so, set the user data and connect the socket
  const getUserProfileData=async()=>{
    try {
      const {data}=await api.get(`/api/user/profile`);
      if(data.success){
        setAuthUser(data.user);
        connectSocket(data.user);
      }
      else{
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

// login function to handle user authentication and socket connection
// ✅ Login / Signup handler
const loginHandler=async(state,credentials)=>{
  let url = state === 'Sign up' ? 'signup' : 'login';
  let { fullName, email, password,bio } = credentials;
  let formData = state === 'Sign up' ? { fullName, email, password,bio } : { email, password };
  try{
    const {data}=await api.post(`/api/user/${url}`,formData);
    if(data.success){
      setAuthUser(data.userData);
      connectSocket(data.userData);
      // Save token and connect socket
      if (data.token) {
          setToken(data.token);
          localStorage.setItem("token", data.token);
        }

        toast.success(`${state} successful`);
        return data;
    }
    else{
      toast.error(data.message);
    }
  } catch (error) {
    console.log(error);
      toast.error(error.message);
  }
}


// logout function to handle user logout and socket disconnection
const logoutHandler = async () => {
    try {
      // Optional: make API call to backend to invalidate token if needed
      // await api.post("/api/user/logout");

      // Cleanup
      localStorage.removeItem("token");
      setToken("");
      setAuthUser(null);
      setOnlineUsers([]);

      if (socket) {
        socket.disconnect();
        setSocket(null);
      }

      toast.success("Logged out successfully!");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Error logging out");
    }
  };


const updateUserProfileData=async(body)=>{
  try {
    const {data}=await api.put(`/api/user/update-profile`,body);
    if(data.success){
      setAuthUser(data.user);
      toast.success("Profile updated successfully");
    }
    else{
      toast.error(data.message);
    }
  } catch (error) {
    console.error(error);
      toast.error(error.message);
  }
}


// ✅ Check auth on first render (if token exists)
  useEffect(()=>{
  if(token){
    getUserProfileData();
  }
  },[token]);

  const value={
        token,
        setToken,
        authUser,
        setAuthUser,
        onlineUsers,
        setOnlineUsers,
        socket,
        setSocket,
        connectSocket,
        getUserProfileData,
        loginHandler,
        logoutHandler,
        updateUserProfileData,
  };

  return (
  <AppContext.Provider value={value}>
     {children}
  </AppContext.Provider>
  )
}


export default AppContext;