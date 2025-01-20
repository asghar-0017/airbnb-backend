import { Server } from 'socket.io';

export default function initializeSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join room for a specific chat (room ID: `chatId`)
    socket.on('join_room', (chatId) => {
      socket.join(chatId);
      console.log(`User joined room: ${chatId}`);
    });

    // Handle sending a message
    socket.on('send_message', ({ chatId, message, sender }) => {
      io.to(chatId).emit('receive_message', { message, sender, timestamp: new Date() });
      console.log(`Message sent in room ${chatId}:`, message);
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
}
