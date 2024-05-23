import axios from "axios";
import { Conversation, Message } from "../models/chatModel.js";

//////////// CREATE OR GET CONVER STATION ///////////////////

export const getOrCreateConversation = async (senderId, receiverId) => {
  let conversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] }
  });

  if (!conversation) {
      conversation = new Conversation({
          members: [senderId, receiverId]
      });
      await conversation.save();
  }

  return conversation;
};





//////////// send message /////////////


export const sendMessage = async (req, res) => {
    const {text, seen, img ,time} = req.body;
    const {senderId, receiverId} = req.params
    // const user = await axios.get('http://localhost:8000/api/currentuser',{
    //   headers:{
    //     Authorization:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjQyMGFhZTk4ZjBjMzM3YzA0NTNlYWIiLCJpYXQiOjE3MTYxMjQ0NTl9.p3R1GJvoylaJCT1y7S9VJjoqWLPOCYAzU-tB4oXbt10"
    //   }
    // })
    // console.log(user)

    try {

      const conversation = await getOrCreateConversation(senderId, receiverId);
      const newMessage = new Message({ 
        conversationId:conversation._id, 
        sender: senderId,
        text,
        seen,
        img ,
        time
      });
      await newMessage.save();
      res.status(201).json(newMessage);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


  /////// GET ALL CHATS /////////

  export const getChats = async (req,res) => {
    const { conversationId } = req.params;

    try {
      const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
   



  ////  GET CONVER STATION /////////

  export const  getConversation = async (req, res) => {
    const { senderId, receiverId } = req.params;
    try {
      const conversation = await getOrCreateConversation(senderId,receiverId)
      res.status(200).json(conversation)
    } catch (error) {
      res.status(500).json({ error: error.message });
    }



  }