import TemporaryListing from "../../model/temporaryLIsting/index.js";
import ListingModel from '../../model/listingModel/index.js'
export const adminController = {
  getAllListings: async (req, res) => {
    try {
      let listings;

      listings = await TemporaryListing.find().populate('hostId'); // Populate the hostId field
      const transformedListings = listings.map(listing => {
        const listingObject = listing.toObject(); // Convert listing to plain object
        if (listing.hostId) {
          listingObject.hostData = listing.hostId; // Add host data
        }
        delete listingObject.hostId; // Remove the hostId field
        return listingObject;
      });

      res.status(200).json({ message: 'Listings fetched successfully.', listings: transformedListings });
    } catch (error) {
      console.error('Error fetching listings:', error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  },

  confirmListing: async (req, res) => {
    try {
      const listingId = req.params.listingId;

      const temporaryListingData = await TemporaryListing.findById(listingId);
      if (!temporaryListingData) {
        return res.status(404).json({ message: 'Temporary listing not found.' });
      }

      const confirmedListing = new ListingModel(temporaryListingData.toObject());
      await confirmedListing.save();

      await TemporaryListing.findByIdAndDelete(listingId);

      res.status(200).json({ message: 'Listing confirmed successfully.' });
    } catch (error) {
      console.error('Error confirming listing:', error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  },
};
