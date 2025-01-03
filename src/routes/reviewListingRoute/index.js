import { reviewListingController } from '../../controller/reviewListingController/index.js';
import { authenticateHost } from '../../middleWare/index.js';

const reviewListingRoute = (app) => {
  app.post('/reviews/:listingId', authenticateHost, reviewListingController.addReview);
  app.get('/reviews/:listingId', reviewListingController.getReviewsByListingId);
};

export default reviewListingRoute;
