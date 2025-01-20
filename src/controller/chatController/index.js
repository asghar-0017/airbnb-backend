import Chat from '../../model/chatModel/index.js';
import User from '../../model/hostModel/index.js';

export const chatController = {
  sendMessage: async (io,req, res) => {
    const { guestId, message } = req.body;
    const hostId = req.user._id; 
  
    console.log('guestId:', guestId);
    console.log('hostId:', hostId);
    console.log('message:', message);
  
    if (!guestId || !hostId || !message) {
      return res.status(400).json({ message: 'Both hostId and guestId are required, along with the message.' });
    }
  
    try {
      const [user1, user2] = [hostId, guestId].sort();
        let chat = await Chat.findOne({ hostId: user1, guestId: user2 });
      if (!chat) {
        chat = new Chat({ hostId: user1, guestId: user2, messages: [] });
      }
      chat.messages.push({ senderId: hostId, message });
      await chat.save();

 
      io.emit("send_message", chat);
      res.status(201).json({ message: 'Message sent successfully.', chat });
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  },

  listSentMessages: async (io,req, res) => {
    const userId = req.user._id;

    try {
      const sentMessages = await Chat.find({
        $or: [{ hostId: userId }, { guestId: userId }],
      })

      if (!sentMessages || sentMessages.length === 0) {
        return res.status(404).json({ message: 'No messages found.' });
      }

      const formattedMessages = sentMessages.map((chat) => {
        const isHost = String(chat.hostId._id) === String(userId);

        return {
          userType: isHost ? 'host' : 'guest',
          userId: isHost ? chat.guestId._id : chat.hostId._id,
          userName: isHost ? chat.guestId.userName : chat.hostId.userName,
          messages: chat.messages
            .filter((msg) => String(msg.senderId) === String(userId))
            .map((msg) => ({
              message: msg.message,
              timestamp: msg.timestamp,
            })),
        };
      });
      io.emit("receive_message", formattedMessages);


      res.status(200).json({ sentMessages: formattedMessages });
    } catch (error) {
      console.error('Error listing sent messages:', error.message);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  getChat: async (io,req, res) => {
    const userId = req.params.userId;
    const currentUserId = req.user._id;

    try {
      const [user1, user2] = [currentUserId, userId].sort();
      const chat = await Chat.findOne({ hostId: user1, guestId: user2 })
    

      if (!chat) {
        return res.status(404).json({ message: 'No chat found between the specified users.' });
      }
   
      io.emit("receive_message",{chatId: chat._id,
        host: chat.hostId,
        guest: chat.guestId,
        messages: chat.messages
      }
      );


      res.status(200).json({
        chatId: chat._id,
        host: chat.hostId,
        guest: chat.guestId,
        messages: chat.messages,
      });
    } catch (error) {
      console.error('Error retrieving chat:', error.message);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },
};
