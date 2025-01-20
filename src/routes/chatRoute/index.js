import { chatController } from '../../controller/chatController/index.js';
import combinedAuthenticate from '../../middleWare/combineAuthenticate/index.js';

// const chatRoute = (app) => {
//   app.post('/send-message', combinedAuthenticate, chatController.sendMessage); 
//   app.get('/get-chat/:guestId', combinedAuthenticate, chatController.getChat); 
//   app.get('/list-chats', combinedAuthenticate, chatController.listChats);
// }

const chatRoute = (app) => {
  app.post('/send-message', combinedAuthenticate, chatController.sendMessage); 
  app.get('/get-chat/:userId', combinedAuthenticate, chatController.getChat); 
  app.get('/list-sent-messages', combinedAuthenticate, chatController.listSentMessages); // New API for sent messages
};
export default chatRoute;
