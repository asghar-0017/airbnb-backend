import listingModel from '../../model/listingModel/index.js';
import Listing from '../../model/listingModel/index.js';
import Host from '../../model/hostModel/index.js'

export const listingController = {
  createListing: async (req, res) => {
    console.log("API hit");
    try {
      const {
        placeType,
        roomType,
        guestCapacity,
        bedrooms,
        beds,
        bathrooms,
        amenities,
        title,
        description,
        weekdayPrice,
        weekendPrice,
        street,
        flat,
        city,
        town,
        postcode,
        latitude,
        longitude
      
      } = req.body;

      // if (!req.files || req.files.length < 3) {
      //   return res.status(400).json({ message: 'At least 3 photos are required.' });
      // }

      // const photos = req.files.map((file) => file.path);

      if (!weekdayPrice || isNaN(weekdayPrice)) {
        return res.status(400).json({ message: 'Valid weekdayPrice is required.' });
      }

      if (!weekendPrice || isNaN(weekendPrice)) {
        return res.status(400).json({ message: 'Valid weekendPrice is required.' });
      }

      const newListing = new Listing({
        hostId: req.user._id,
        placeType,
        roomType,
        guestCapacity,
        bedrooms,
        beds,
        bathrooms,
        amenities,
        // photos,
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
        longitude
      });

      await newListing.save();
      res.status(201).json({ message: 'Listing created successfully', listing: newListing });
    } catch (error) {
      console.error('Error creating listing:', error);
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
      const listing = await Listing.findById(id); 

      if (!listing) {
        return res.status(404).json({ message: 'Listing not found' });
      }

      res.status(200).json({ message: 'Listing fetched successfully', listing });
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  },

  getAllListings:async(req,res)=>{
    try{
      const data=await Listing.find()
      if (!data) {
        return res.status(404).json({ message: 'Listing not found' });
      }
        res.status(200).json({ message: 'Listing fetched successfully', data });
      
    }catch(error){
      res.status(500).json({ message: 'Internal Server Error', error: error.message });

    }
  }

};

