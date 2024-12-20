import Listing from '../../model/listingModel/index.js';

export const bookingController = {
  bookListing: async (req, res) => {
    try {
      const { listingId } = req.params;
      const { startDate, endDate } = req.body;

      if (!startDate || !endDate) {
        return res.status(400).json({ message: 'Start and end dates are required' });
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
        return res.status(403).json({
          message: 'You cannot book your own listing.',
        });
      }
      const overlappingBooking = listing.bookings.find(
        (booking) =>
          (parsedStartDate >= booking.startDate && parsedStartDate <= booking.endDate) ||
          (parsedEndDate >= booking.startDate && parsedEndDate <= booking.endDate) ||
          (parsedStartDate <= booking.startDate && parsedEndDate >= booking.endDate)
      );

      if (overlappingBooking) {
        return res.status(400).json({
          message: 'Selected dates are already booked',
          conflictingDates: {
            startDate: overlappingBooking.startDate,
            endDate: overlappingBooking.endDate,
          },
        });
      }
      const totalNights =
        (parsedEndDate - parsedStartDate) / (1000 * 60 * 60 * 24); 
      let totalPrice = 0;
      for (let i = 0; i < totalNights; i++) {
        const currentDay = new Date(parsedStartDate);
        currentDay.setDate(currentDay.getDate() + i);

        const isWeekend = [0, 6].includes(currentDay.getDay()); // 0 = Sunday, 6 = Saturday
        totalPrice += isWeekend ? listing.weekendPrice : listing.weekdayPrice;
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
};
