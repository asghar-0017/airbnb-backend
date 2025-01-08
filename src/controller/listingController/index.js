import listingModel from '../../model/listingModel/index.js';
import Listing from '../../model/listingModel/index.js';
import notVerifiedListingSchema from '../../model/notVerifiedListing/index.js';
import Host from '../../model/hostModel/index.js'

export const listingController = {

  createListing: async (req, res) => {
    try {
      const host = await Host.findById(req.user._id);
      if (!host) {
        return res.status(404).json({ message: "Host not found." });
      }
  
      const {
        placeType, roomType, guestCapacity, bedrooms, beds, bathrooms, amenities,
        title, description, weekdayPrice, weekendPrice, street, flat, city, town, postcode,
        latitude, longitude
      } = req.body;
  
      if (!req.files || req.files.length < 3) {
        return res.status(400).json({ message: 'At least 3 photos are required.' });
      }
  
      const photos = req.files.map((file) => file.path);
  
      if (!weekdayPrice || isNaN(weekdayPrice)) {
        return res.status(400).json({ message: 'Valid weekdayPrice is required.' });
      }
  
      if (!weekendPrice || isNaN(weekendPrice)) {
        return res.status(400).json({ message: 'Valid weekendPrice is required.' });
      }
  
      const newListing = new notVerifiedListingSchema({
        hostId: req.user._id,
        placeType,
        roomType,
        guestCapacity,
        bedrooms,
        beds,
        bathrooms,
        amenities,
        photos,
        title,
        description,
        weekdayPrice: parseFloat(weekdayPrice),
        weekendPrice: parseFloat(weekendPrice),
        street,
        flat,
        city,
        town,
        postcode,
        latitude,
        longitude,
      });
  
      await newListing.save();
      res.status(201).json({ message: 'Listing created successfully', listing: newListing });
    } catch (error) {
      console.error('Error creating listing:', error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  },

  notVerifiedListing:async(req,res)=>{
    try {
      const id = req.params.id;
      const listing = await notVerifiedListingSchema.findById(id)
      if (!listing) {
        return res.status(404).json({ message: 'Listing not found' });
      }
    
      const hostData = await Host.findById(listing.hostId);
    
      const hostSelectedData = {
        userName: hostData?.userName,
        email: hostData?.email,
        photoProfile: hostData?.photoProfile,
      };
    
      res.status(200).json({
        message: 'Listing fetched successfully',
        hostData: hostSelectedData,
        listing: {
          ...listing.toObject(),
        },
      });
    } catch (error) {
      console.error('Error fetching listing:', error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  },

  getListingsByHostId: async (req, res) => {
    try {
      const hostId = req.params.hostId; 
      const hostData = await Host.findById(hostId);
      const listing = await Listing.find({hostId});
      const data={
        email:hostData.email,
        userName:hostData.userName,
        photoProfile: hostData.photoProfile
      } 
      if (!listing) {
        return res.status(404).json({ message: 'Listing not found' });
      }
      res.status(200).json({ message: 'Listing fetched successfully', hostData:data,listing });
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  },

  getListingById: async (req, res) => {
    try {
      const id = req.params.id;
      const listing = await Listing.findById(id).populate('confirmedBookings');
      if (!listing) {
        return res.status(404).json({ message: 'Listing not found' });
      }
    
      const hostData = await Host.findById(listing.hostId);
    
      const hostSelectedData = {
        userName: hostData?.userName,
        email: hostData?.email,
        photoProfile: hostData?.photoProfile,
      };
    
      res.status(200).json({
        message: 'Listing fetched successfully',
        hostData: hostSelectedData,
        listing: {
          ...listing.toObject(),
          bookings: listing.confirmedBookings.map(booking => ({
            userId: booking.userId,
            startDate: booking.startDate,
            endDate: booking.endDate,
            totalPrice: booking.totalPrice,
            bookingDate: booking.createdAt, 
          })),
        },
      });
    } catch (error) {
      console.error('Error fetching listing:', error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  },
  
  
  getAllListings: async (req, res) => {
    try {
      const loggedInUserId = req.query.userId; 
      let listings;
  
      if (loggedInUserId) {
        listings = await Listing.find({ hostId: { $ne: loggedInUserId } })
          .populate('hostId', 'userName email photoProfile'); 
      } else {
        listings = await Listing.find()
          .populate('hostId', 'userName email photoProfile'); 
      }
  
      if (!listings.length) {
        return res.status(404).json({ message: 'No listings found.' });
      }
  
      const transformedListings = listings.map(listing => {
        const host = listing.hostId; 
        const listingObject = listing.toObject();
        listingObject.hostData = host;
        delete listingObject.hostId; 
        return listingObject;
      });
  
      res.status(200).json({ message: 'Listings fetched successfully.', listings: transformedListings });
    } catch (error) {
      console.error('Error fetching listings:', error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  },
  
  

  updateListing: async (req, res) => {
    try {
      const listingId = req.params.id;
      const { imageIndex, ...updateData } = req.body; 
      const newImage = req.file?.path; 
      const listing = await Listing.findById(listingId);
  
      if (!listing) {
        return res.status(404).json({ message: 'Listing not found.' });
      }
        if (newImage && typeof imageIndex !== 'undefined') {
        if (!Array.isArray(listing.photos) || imageIndex < 0 || imageIndex >= listing.photos.length) {
          return res.status(400).json({ message: 'Invalid image index.' });
        }
        listing.photos[imageIndex] = newImage;
      }
        if (Object.keys(updateData).length > 0) {
        Object.keys(updateData).forEach((key) => {
          if (listing[key] !== undefined) {
            listing[key] = updateData[key];
          }
        });
      }
        await listing.save();
  
      res.status(200).json({ message: 'Listing updated successfully', listing });
    } catch (error) {
      console.error('Error updating listing:', error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  },
  
  deleteListing: async (req, res) => {
    try {
      const listingId = req.params.id;

      const deletedListing = await Listing.findByIdAndDelete(listingId);

      if (!deletedListing) {
        return res.status(404).json({ message: 'Listing not found' });
      }

      res.status(200).json({ message: 'Listing deleted successfully' });
    } catch (error) {
      console.error('Error deleting listing:', error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  },


};

