
export default function initializeSocket(io) {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
    socket.on('join_room', ({ hostId, guestId }) => {
      if (!hostId || !guestId) {
        console.error('join_room event received without hostId or guestId');
        return;
      }
      const roomId = [hostId, guestId].sort().join('_');
      socket.join(roomId);
      console.log(`User joined room: ${roomId}`);
    });

    socket.on('send_message', ({ message, sender, hostId, guestId }) => {
      if (!message || !sender || !hostId || !guestId) {
        console.error('send_message event received with missing fields');
        return;
      }

      const roomId = [hostId, guestId].sort().join('_');
      
      io.to(roomId).emit('receive_message', {
        message,
        sender,
        timestamp: new Date(),
      });

      console.log(`Message sent in room ${roomId}:`, message);
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
}
