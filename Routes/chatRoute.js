import express from "express";
import { getChats, getConversation, sendMessage } from "../controller/chatController.js";
const Router = express.Router();

Router.post("/api/startchat/:senderId/:receiverId", sendMessage);
Router.get('/api/getchats/:conversationId',getChats)
.get('/api/conversation/:senderId/:receiverId', getConversation)

export default Router;
