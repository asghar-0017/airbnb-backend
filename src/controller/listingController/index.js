import Listing from '../../model/listingModel/index.js';

export const listingController = {
  createListing: async (req, res) => {
    try {
      const {
        placeType,
        roomType,
        location,
        guestCapacity,
        bedrooms,
        beds,
        bathrooms,
        amenities,
        title,
        description,
        weekdayPrice,
        weekendPrice,
      } = req.body;

      if (!req.files || req.files.length < 3) {
        return res.status(400).json({ message: 'At least 3 photos are required.' });
      }

      const photos = req.files.map((file) => file.path);

      const newListing = new Listing({
        hostId: req.user._id,
        placeType,
        roomType,
        location,
        guestCapacity,
        bedrooms,
        beds,
        bathrooms,
        amenities,
        photos,
        title,
        description,
        weekdayPrice,
        weekendPrice,
      });

      await newListing.save();
      res.status(201).json({ message: 'Listing created successfully', listing: newListing });
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  },

  getListingsByHostId: async (req, res) => {
    try {
      const hostId = req.params.hostId; 
      const listing = await Listing.find({hostId}); 

      if (!listing) {
        return res.status(404).json({ message: 'Listing not found' });
      }

      res.status(200).json({ message: 'Listing fetched successfully', listing });
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  },
  getListingById: async (req, res) => {
    try {
      const id = req.params.id; 
      const listing = await Listing.findById(id); 

      if (!listing) {
        return res.status(404).json({ message: 'Listing not found' });
      }

      res.status(200).json({ message: 'Listing fetched successfully', listing });
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  },

};

