import { Server } from 'socket.io';

export default function initializeSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: '*', // Replace with the actual frontend URL
    },
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // User joins a room for a specific chat (identified by `chatId`)
    socket.on('join_room', (chatId) => {
      if (!chatId) {
        console.error('join_room event received without a chatId');
        return;
      }
      socket.join(chatId);
      console.log(`User joined room: ${chatId}`);
    });

    // Handle sending a message to a specific chat room
    socket.on('send_message', ({ chatId, message, sender }) => {
      if (!chatId || !message || !sender) {
        console.error('send_message event received with missing fields');
        return;
      }
      io.to(chatId).emit('receive_message', {
        message,
        sender,
        timestamp: new Date(),
      });
      console.log(`Message sent in room ${chatId}:`, message);
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  // Attach io to the app
  server.io = io;
}
