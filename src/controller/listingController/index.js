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

  getLocationByListing: async (req, res) => {
    try {
      const location = await Location.findOne({ listingId: req.params.listingId });
      if (!location) {
        return res.status(404).json({ message: 'Location not found' });
      }
      res.status(200).json(location);
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  },
};

