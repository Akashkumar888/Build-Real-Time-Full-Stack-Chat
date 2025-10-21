
import express from 'express'
import { authUser } from '../middlewares/authUser.middleware.js';
import { getMessages, getUsersForSidebar, markMessageAsSeen, sendMessage } from '../controllers/message.controller.js';
const messageRouter=express();

messageRouter.get("/users",authUser,getUsersForSidebar);
messageRouter.get("/:id",authUser,getMessages); // dynamic routes 
messageRouter.put("/mark/:id",authUser,markMessageAsSeen); // update anything then use put HTTP method 
messageRouter.post("/send/:id",authUser,sendMessage);

export default messageRouter;