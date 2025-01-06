import TemporaryListing from "../../model/temporaryLIsting/index.js";

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
};
