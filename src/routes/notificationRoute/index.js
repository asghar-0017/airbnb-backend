import { notificationController } from '../../controller/notificationController/index.js';
import combinedAuthenticate from '../../middleWare/combineAuthenticate/index.js';

const notificationRoutes = (app, io) => {
  app.get('/notifications', combinedAuthenticate, (req, res) =>
    notificationController.getNotifications(io, req, res)
  );
  app.get('/notifications/unread', combinedAuthenticate, (req, res) =>
    notificationController.getUnreadNotifications(io, req, res)
  );
  app.put('/notifications/:notificationId', combinedAuthenticate, (req, res) =>
    notificationController.markAsRead(io, req, res)
  );
};

export default notificationRoutes;
