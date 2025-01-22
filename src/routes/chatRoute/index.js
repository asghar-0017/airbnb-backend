import { chatController } from '../../controller/chatController/index.js';
import combinedAuthenticate from '../../middleWare/combineAuthenticate/index.js';


const chatRoute = (app,io) => {
  app.post('/send-message', combinedAuthenticate, (req, res) => chatController.sendMessage(io, req, res)); 
  app.get('/get-chat/:userId', combinedAuthenticate, (req, res) => chatController.getChat(io, req, res)); 
  app.get('/list-guest-messages', combinedAuthenticate, (req, res) => chatController.listSentMessages(io, req, res)); 
  app.get('/list-host-messages', combinedAuthenticate, (req, res) => chatController.listHostMessages(io, req, res)); 
  app.get('/list-users-for-messages', combinedAuthenticate, (req, res) =>
    chatController.listUsersForMessages(io, req, res)
  ); 
  
};
export default chatRoute;
