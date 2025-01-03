import Review from '../../model/reviewListings/index.js';
import ConfirmedBooking from '../../model/confirmBooking/index.js';
import Listing from '../../model/listingModel/index.js';

export const reviewListingController = {
    addReview: async (req, res) => {
        try {
          const { listingId } = req.params;
          const { rating, comment } = req.body;
          const userId = req.user._id;
    
          if (!rating || isNaN(rating) || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
          }
    
          if (!comment || comment.trim().length === 0) {
            return res.status(400).json({ message: 'Comment is required.' });
          }
    
          const listing = await Listing.findById(listingId);
          if (!listing) {
            return res.status(404).json({ message: 'Listing not found.' });
          }
          if (String(listing.hostId) === String(userId)) {
            return res.status(403).json({ message: 'You cannot review your own listing.' });
          }
    
          const today = new Date();
          const booking = await ConfirmedBooking.findOne({
            userId,
            listingId,
            endDate: { $lt: today },
          });
    
          if (!booking) {
            return res.status(403).json({ message: 'You can only review listings you have booked and checked out of.' });
          }
          const review = new Review({
            hostId: userId,
            listingId,
            rating,
            comment,
          });
    
          await review.save();
    
          res.status(201).json({ message: 'Review added successfully.', review });
        } catch (error) {
          console.error('Error adding review:', error);
          res.status(500).json({ message: 'Internal Server Error', error: error.message });
        }
      },

  getReviewsByListingId: async (req, res) => {
    try {
      const { listingId } = req.params;
      const reviews = await Review.find({ listingId }).populate('hostId', 'userName email photoProfile');

      if (!reviews.length) {
        return res.status(404).json({ message: 'No reviews found for this listing.' });
      }
      const totalRatings = reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = (totalRatings / reviews.length).toFixed(1); 

      res.status(200).json({
        message: 'Reviews fetched successfully.',
        averageRating,
        reviews,
      });
    } catch (error) {
      console.error('Error fetching reviews:', error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  },
};
