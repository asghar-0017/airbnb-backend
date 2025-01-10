import Review from '../../model/reviewListings/index.js';
import ConfirmedBooking from '../../model/confirmBooking/index.js';
import Listing from '../../model/listingModel/index.js';

export const reviewListingController = {
  addReview: async (req, res) => {
    try {
      const { listingId } = req.params;
      const { rating, comment } = req.body;
      const userId = req.user._id;

      console.log('Adding review for listing:', listingId, 'by user:', userId);

      // Validate rating
      if (!rating || isNaN(rating) || rating < 1 || rating > 5) {
        console.log('Invalid rating:', rating);
        return res.status(400).json({ message: 'Rating must be a number between 1 and 5.' });
      }

      // Validate comment
      if (!comment || comment.trim().length === 0) {
        console.log('Comment is missing or empty');
        return res.status(400).json({ message: 'Comment is required.' });
      }

      // Check if the listing exists
      const listing = await Listing.findById(listingId);
      if (!listing) {
        console.log('Listing not found:', listingId);
        return res.status(404).json({ message: 'Listing not found.' });
      }

      // Prevent reviewing own listing
      if (String(listing.hostId) === String(userId)) {
        console.log('User attempted to review their own listing');
        return res.status(403).json({ message: 'You cannot review your own listing.' });
      }

      // Check if the user has a valid booking for this listing that has ended
      const today = new Date();
      const booking = await ConfirmedBooking.findOne({
        userId,
        listingId,
        endDate: { $lte: today }, // Corrected MongoDB operator
      });

      if (!booking) {
        console.log('No valid booking found for user:', userId, 'and listing:', listingId);
        return res.status(403).json({
          message: 'You can only review listings you have booked and checked out of.',
        });
      }

      // Create and save the review
      const review = new Review({
        hostId: userId,
        listingId,
        rating,
        comment,
      });

      await review.save();
      console.log('Review saved successfully for listing:', listingId);

      res.status(201).json({ message: 'Review added successfully.', review });
    } catch (error) {
      console.error('Error adding review:', error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  },

  getReviewsByListingId: async (req, res) => {
    try {
      const { listingId } = req.params;

      console.log('Fetching reviews for listing:', listingId);

      // Fetch reviews for the listing
      const reviews = await Review.find({ listingId }).populate(
        'hostId',
        'userName email photoProfile'
      );

      if (!reviews.length) {
        console.log('No reviews found for listing:', listingId);
        return res.status(404).json({ message: 'No reviews found for this listing.' });
      }

      // Calculate the average rating
      const totalRatings = reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = (totalRatings / reviews.length).toFixed(1);

      console.log('Reviews fetched successfully for listing:', listingId);

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
