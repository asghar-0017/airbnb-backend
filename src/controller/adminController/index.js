import TemporaryListing from "../../model/temporaryLIsting/index.js";
import ListingModel from '../../model/listingModel/index.js'
import Host from '../../model/hostModel/index.js'
export const adminController = {
  getAllListings: async (req, res) => {
    try {
      let listings;

      listings = await TemporaryListing.find().populate('hostId'); 

     listings = listings.filter(listing => {
      const host = listing.hostId; 
      return host && host.CNIC && host.CNIC.isVerified; 
    });

      const transformedListings = listings.map(listing => {
        const listingObject = listing.toObject(); 
        if (listing.hostId) {
          listingObject.hostData = listing.hostId; 
        }
        delete listingObject.hostId; 
        return listingObject;
      });

      res.status(200).json({ message: 'Listings fetched successfully.', listings: transformedListings });
    } catch (error) {
      console.error('Error fetching listings:', error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  },

  // confirmListing: async (req, res) => {
  //   try {
  //     const listingId = req.params.listingId;
  //     console.log("listingId",listingId)

  //     const temporaryListingData = await TemporaryListing.findById(listingId);
  //     if (!temporaryListingData) {
  //       return res.status(404).json({ message: 'Temporary listing not found.' });
  //     }

  //     const confirmedListing = new ListingModel(temporaryListingData.toObject());
  //     await confirmedListing.save();

  //     await TemporaryListing.findByIdAndDelete(listingId);

  //     res.status(200).json({ message: 'Listing confirmed successfully.' });
  //   } catch (error) {
  //     console.error('Error confirming listing:', error);
  //     res.status(500).json({ message: 'Internal Server Error', error: error.message });
  //   }
  // },

  confirmListing: async (req, res) => {
    try {
      const listingId = req.params.listingId;
      console.log("listingId",listingId)
        const temporaryListingData = await TemporaryListing.findById(listingId);
        console.log("temporaryListingData",temporaryListingData)

      if (!temporaryListingData) {
        return res.status(404).json({ message: 'Temporary listing not found.' });
      }
        const hostData = await Host.findById(temporaryListingData.hostId);
        console.log("Host Data",hostData)
      if (!hostData) {
        return res.status(404).json({ message: 'Host not found.' });
      }
        if (!hostData.CNIC?.isVerified) {
        return res.status(400).json({ message: 'Host CNIC is not verified. Cannot confirm listing.' });
      }
        const confirmedListing = new ListingModel(temporaryListingData.toObject());
      await confirmedListing.save();
        await TemporaryListing.findByIdAndDelete(listingId);
  
      res.status(200).json({ message: 'Listing confirmed successfully.', confirmedListing });
    } catch (error) {
      console.error('Error confirming listing:', error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  },
  
  getPendingCNICVerifications:async(req,res)=>{
    try {
      const pendingHosts = await Host.find({
        "CNIC.isVerified": false,
        "CNIC.images": { $size: 2 },
      }).select("userName email photoProfile CNIC.images CNIC.isVerified");
      
      if (!pendingHosts.length) {
        return res.status(200).json({ message: "No pending CNIC verifications." });
      }
  
      res.status(200).json({
        message: "Pending CNIC verifications fetched successfully.",
        data: pendingHosts,
      });
    } catch (error) {
      console.error("Error fetching pending CNIC verifications:", error);
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  },
   
  verifyCNIC:async (req, res) => {
    try {
      const { hostId } = req.params;
  
      const host = await Host.findById(hostId);
      if (!host) {
        return res.status(404).json({ message: "Host not found" });
      }
  
      if (!host.CNIC || !host.CNIC.images || host.CNIC.images.length !== 2) {
        return res.status(400).json({ message: "CNIC images are missing or incomplete." });
      }
        host.CNIC.isVerified = true;
      await host.save();
  
      res.status(200).json({
        message: "CNIC verified successfully.",
        host: {
          userName: host.userName,
          email: host.email,
          cnicStatus: "Verified",
        },
      });
    } catch (error) {
      console.error("Error verifying CNIC:", error);
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  },
  getTemporaryListing: async (req, res) => {
    try {
      const listingId = req.params.listingId; 
      const data = await TemporaryListing.findById(listingId);
      if (data) {
        return res.status(200).send({ message: "Listing fetched successfully", data: data });
      } 
      return res.status(404).send({ message: 'Listing Not Found' });
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error", error: error.message });
    }
  }
  
  
};
