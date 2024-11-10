import Message from "../models/Message.js";
import User from "../models/user.js";
// import SelectedChat from '../models/selectedMember.js';

// Fetch messages for a specific member
export const getMessagesByMember = async (req, res) => {
  const { member } = req.query;

  try {
    const user = await User.findOne({ fullName: member });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch messages where the user is either the sender or the receiver
    const messages = await Message.find({
      $or: [{ sender: user._id }, { receiver: user._id }],
    }).sort({ createdAt: -1 });

    if (messages.length === 0) {
      return res
        .status(200)
        .json({ message: "No messages found for this user." });
    }

    return res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return res.status(500).json({ message: "Error fetching messages", error });
  }
};

export const getContacts = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "UserId is required" });
    }

    // Find all distinct chat partners (receivers) where the user is the sender
    const messages = await Message.find({ sender: userId }).populate(
      "receiver",
      "fullName userName userType photo email"
    );

    // Example in getContacts
    const contacts = new Map();
    messages.forEach((msg) => {
      const { chatId, receiver } = msg;
      if (receiver) {
        contacts.set(receiver._id.toString(), {
          id: receiver._id, // or use receiver.id if applicable
          fullName: receiver.fullName,
          userName: receiver.userName,
          userType: receiver.userType,
          photo: receiver.photo,
          email: receiver.email,
          chatId,
        });
      }
    });

    // Convert map values to an array and send as a response
    return res.status(200).json([...contacts.values()]);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getMessagesByChatId = async (req, res) => {
  const { chatId } = req.params;
  const { userId } = req.query;

  try {
    const query = { chatId };
    if (userId) {
      query.$or = [{ sender: userId }, { receiver: userId }];
    }

    const messages = await Message.find(query).sort({ createdAt: 1 });

    if (messages.length > 0) {
      return res.status(200).json(messages);
    } else {
      // If no messages found, return a response saying no messages
      // Instead of trying to create a new message, return a message indicating the chat is empty
      return res
        .status(200)
        .json({ message: "No messages yet. Start a new conversation!" });
    }
  } catch (error) {
    console.error("Error retrieving messages by chatId:", error);
    return res
      .status(500)
      .json({ message: "Error retrieving messages", error });
  }
};

export const getLastMessageByChatId = async (req, res) => {
    const { chatId } = req.params;
    const { userId } = req.query;
  
    try {
      const query = { chatId };
      if (userId) {
        query.$or = [{ sender: userId }, { receiver: userId }];
      }
  
      // Find the last message only by sorting in descending order and limiting to 1
      const lastMessage = await Message.findOne(query).sort({ createdAt: -1 });
  
      if (lastMessage) {
        return res.status(200).json(lastMessage);
      } else {
        // No messages found, return an informative message
        return res.status(200).json({ message: "No messages yet. Start a new conversation!" });
      }
    } catch (error) {
      console.error("Error retrieving last message by chatId:", error);
      return res.status(500).json({ message: "Error retrieving messages", error });
    }
  };
  