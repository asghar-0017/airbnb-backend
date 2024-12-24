import Listing from '../../model/listingModel/index.js';

export const bookingController = {
  bookListing: async (req, res) => {
    try {
      const { listingId } = req.params;
      const { startDate, endDate,guestCapacity } = req.body;
  
      if (!startDate || !endDate || !guestCapacity) {
        return res.status(400).json({ message: 'guestCapacity,Start and end dates are required' });
      }
      const listingData=await Listing.findById(listingId)
      if(guestCapacity>listingData.guestCapacity){
        return res.status(400).json({ message: `guest Capacity Should be ${listingData.guestCapacity}` });
      }
  
      const parsedStartDate = new Date(startDate);
      const parsedEndDate = new Date(endDate);
  
      if (parsedStartDate >= parsedEndDate) {
        return res.status(400).json({ message: 'End date must be after start date' });
      }
  
      const listing = await Listing.findById(listingId);
  
      if (!listing) {
        return res.status(404).json({ message: 'Listing not found' });
      }
  
      if (listing.hostId.toString() === req.user._id.toString()) {
        return res.status(403).json({ message: 'You cannot book your own listing.' });
      }
  
      const overlappingBooking = listing.bookings.find(
        (booking) =>
          (parsedStartDate >= booking.startDate && parsedStartDate <= booking.endDate) ||
          (parsedEndDate >= booking.startDate && parsedEndDate <= booking.endDate) ||
          (parsedStartDate <= booking.startDate && parsedEndDate >= booking.endDate)
      );
  
      if (overlappingBooking) {
        return res.status(200).json({
          message: 'Selected dates are already booked',
          conflictingDates: {
            startDate: overlappingBooking.startDate,
            endDate: overlappingBooking.endDate,
          },
        });
      }
  
      const totalNights = (parsedEndDate - parsedStartDate) / (1000 * 60 * 60 * 24);
      let totalPrice = 0;
  
      for (let i = 0; i < totalNights; i++) {
        const currentDay = new Date(parsedStartDate);
        currentDay.setDate(currentDay.getDate() + i);
  
        const isWeekend = [0, 6].includes(currentDay.getDay());
        totalPrice += isWeekend
          ? listing.weekendActualPrice
          : listing.weekdayActualPrice;
      }
  
      listing.bookings.push({
        userId: req.user._id,
        startDate: parsedStartDate,
        endDate: parsedEndDate,
        totalPrice,
      });
  
      await listing.save();
  
      res.status(200).json({
        message: 'Booking successful',
        booking: {
          listingId: listing._id,
          userId: req.user._id,
          startDate: parsedStartDate,
          endDate: parsedEndDate,
          totalPrice,
        },
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  },

  getBookingsToday: async (req, res) => {
    try {
      const { hostId } = req.params; // Get hostId from route parameters
      console.log("hostId", hostId);
  
      // Get today's start and end times in UTC
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0); // Start of today in UTC
  
      const tomorrow = new Date(today);
      tomorrow.setUTCDate(today.getUTCDate() + 1); // Start of the next day in UTC
  
      // Find listings for the specific host
      const listings = await Listing.find({ hostId });
      console.log("listings", listings);
  
      if (!listings || listings.length === 0) {
        return res.status(404).json({ message: 'No listings found for this hostId.' });
      }
  
      // Initialize an array to hold today's bookings
      const todayBookings = [];
  
      // Iterate through listings and filter bookings for today
      listings.forEach((listing) => {
        const listingTodayBookings = listing.bookings.filter(
          (booking) => booking.bookingDate >= today && booking.bookingDate < tomorrow
        );
  
        // Add bookings for this listing to the overall todayBookings array
        if (listingTodayBookings.length > 0) {
          todayBookings.push({
            title: listing.title,
            bookings: listingTodayBookings,
          });
        }
      });
  
      // If no bookings for today
      if (todayBookings.length === 0) {
        return res.status(404).json({ message: 'No bookings for today.' });
      }
  
      res.status(200).json({
        message: 'Bookings for today',
        data: todayBookings,
      });
    } catch (error) {
      console.error("Error in getBookingsToday:", error.message);
      res.status(500).json({
        message: 'Internal Server Error',
        error: error.message,
      });
    }
  }
  
  
   
  
};


