
export default function initializeSocket(io) {
 

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('join_room', (chatId) => {
      if (!chatId) {
        console.error('join_room event received without a chatId');
        return;
      }
      socket.join(chatId);
      console.log(`User joined room: ${chatId}`);
    });

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

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
}