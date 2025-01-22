import Chat from '../../model/chatModel/index.js';
import User from '../../model/hostModel/index.js';

export const chatController = {
  sendMessage: async (io,req, res) => {
    const { guestId, message } = req.body;
    const hostId = req.user._id; 
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

 
      const chatRoomId = `${user1}_${user2}`;
      io.to(chatRoomId).emit('send_message', {
        chatId: chat._id,
        messages: chat.messages,
        host: chat.hostId,
        guest: chat.guestId,
      });
       res.status(201).json({ message: 'Message sent successfully.', chat });
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  },

  listSentMessages: async (io, req, res) => {
    const hostId = req.user._id; 
    try {
      const hostData = await User.findById(hostId).select('userName email photoProfile');
      if (!hostData) {
        return res.status(404).json({ message: 'Host not found.' });
      }
        const chats = await Chat.find({ hostId })
        .populate({
          path: 'guestId', 
          model: 'Host',
          select: 'userName email photoProfile',
        });
  
      if (!chats || chats.length === 0) {
        return res.status(404).json({ message: 'No messages found for this host.' });
      }
        const guestMessages = chats.map(chat => ({
        guestId: chat.guestId._id,
        guestName: chat.guestId.userName,
        guestEmail: chat.guestId.email,
        guestPhotoProfile: chat.guestId.photoProfile,
        // messages: chat.messages.filter(msg => String(msg.senderId) === String(chat.guestId._id)), // Messages sent by the guest
      }));
  
      const response = {
        host: {
          hostId: hostData._id,
          hostName: hostData.userName,
          hostEmail: hostData.email,
          hostPhotoProfile: hostData.photoProfile,
        },
        guests: guestMessages,
      };
  
      io.emit('guest_messages', response); 
  
      res.status(200).json(response);
    } catch (error) {
      console.error('Error listing guest messages:', error.message);
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
   
      const chatRoomId = `${user1}_${user2}`;
      io.to(chatRoomId).emit('receive_message', chat);

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
  listHostMessages: async (io, req, res) => {
    const guestId = req.user._id; 
    try {
      const guestData = await User.findById(guestId).select('userName email photoProfile');
      if (!guestData) {
        return res.status(404).json({ message: 'Guest not found.' });
      }
      const chats = await Chat.find({ guestId }).populate({
        path: 'hostId',
        model: 'Host', 
        select: 'userName email photoProfile',
      });

      if (!chats || chats.length === 0) {
        return res.status(404).json({ message: 'No messages found for this guest.' });
      }
      const hostMessages = chats.map(chat => ({
        hostId: chat.hostId._id,
        hostName: chat.hostId.userName,
        hostEmail: chat.hostId.email,
        hostPhotoProfile: chat.hostId.photoProfile,
      }));

      const response = {
        guest: {
          guestId: guestData._id,
          guestName: guestData.userName,
          guestEmail: guestData.email,
          guestPhotoProfile: guestData.photoProfile,
        },
        hosts: hostMessages,
      };

      io.emit('host_messages', response); 
      res.status(200).json(response);
    } catch (error) {
      console.error('Error listing host messages:', error.message);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },


  
    listUserMessages: async (io, req, res) => {
      const currentUserId = req.user._id; 
  
      try {
        const chats = await Chat.find({
          $or: [{ hostId: currentUserId }, { guestId: currentUserId }],
        })
          .populate({
            path: 'hostId',
            model: 'Host',
            select: 'userName email photoProfile',
          })
          .populate({
            path: 'guestId',
            model: 'Host',
            select: 'userName email photoProfile',
          });
  
        if (!chats || chats.length === 0) {
          return res.status(404).json({ message: 'No chats found for this user.' });
        }
          const userList = chats.map(chat => {
          const isCurrentUserHost = String(chat.hostId._id) === String(currentUserId);
  
          return isCurrentUserHost
            ? {
                id: chat.guestId._id,
                name: chat.guestId.userName,
                email: chat.guestId.email,
                photoProfile: chat.guestId.photoProfile,
                type: 'guest', 
              }
            : {
                id: chat.hostId._id,
                name: chat.hostId.userName,
                email: chat.hostId.email,
                photoProfile: chat.hostId.photoProfile,
                type: 'host', 
              };
        });
  
        const uniqueUsers = Array.from(
          new Map(userList.map(user => [user.id, user])).values()
        ); 
  
        const response = {
          currentUserId,
          users: uniqueUsers,
        };
          io.emit('user_list', response);
  
        res.status(200).json(response);
      } catch (error) {
        console.error('Error listing user interactions:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    },
  
  
};
