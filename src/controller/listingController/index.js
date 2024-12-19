import Listing from '../../model/listingModel/index.js';

const listingController={
    createListing : async (req, res) => {
        try {
          const {
            hostId,
            placeType,
            roomType,
            title,
            description,
            weekdayPrice,
            weekendPrice,
            amenities,
          } = req.body;
      
          const photos = req.files.map((file) => file.path);
    
          const newListing = new Listing({
            hostId,
            placeType,
            roomType,
            title,
            description,
            weekdayPrice,
            weekendPrice,
            photos,
            amenities,
          });
      
          await newListing.save();
          res.status(201).json({ message: 'Listing created successfully', listing: newListing });
        } catch (error) {
          res.status(500).json({ message: 'Internal Server Error', error: error.message });
        }
      },
       getLocationByListing : async (req, res) => {
        try {
          const location = await Location.findOne({ listingId: req.params.listingId });
          if (!location) {
            return res.status(404).json({ message: 'Location not found' });
          }
          res.status(200).json(location);
        } catch (error) {
          res.status(500).json({ message: 'Internal Server Error', error: error.message });
        }
      }
}

export default listingController

