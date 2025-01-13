import { chatController } from '../../controller/chatController/index.js';
import { authenticateHost } from '../../middleWare/authenticate/index.js';

const chatRoute = (app) => {
  app.post('/create-chat/:hostId/:guestId', authenticateHost, chatController.createChat);
  app.get('/get-chat/:hostId/:guestId', authenticateHost, chatController.getChat);
  app.get('/real-time-chat/:hostId/:guestId', chatController.realTimeChat); // For real-time chat
  app.get('/get-conversations/:receiverId', authenticateHost, chatController.getAllSendersByReceiver); // For real-time chat
};

export default chatRoute;
