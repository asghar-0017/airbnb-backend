import Listing from '../../model/listingModel/index.js';
import TemporaryBooking from '../../model/temporaryBooking/index.js';
import ConfirmedBooking from '../../model/confirmBooking/index.js';
import sendConfirmationEmail from '../../config/confirmEmail/index.js';
import Payment from '../../model/payment/index.js';  
import Stripe from 'stripe'; // Import the Stripe module
const stripeClient= Stripe(process.env.STRIPE_KEY); 
import Host from '../../model/hostModel/index.js'
import Booking from '../../model/confirmBooking/index.js'

export const bookingController = {

createBooking: async (req, res) => {
  try {
    const { listingId } = req.params;
    const { startDate, endDate, guestCapacity, paymentMethodId } = req.body;

    if (!startDate || !endDate || !guestCapacity || !paymentMethodId) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }
    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);
    if (parsedStartDate >= parsedEndDate) {
      return res.status(400).json({ message: 'End date must be after start date.' });
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found.' });
    }

    if (guestCapacity > listing.guestCapacity) {
      return res.status(400).json({ message: 'Guest capacity exceeds limit.' });
    }

    const totalNights = Math.ceil((parsedEndDate - parsedStartDate) / (1000 * 60 * 60 * 24));
    let totalPrice = 0;

    for (let i = 0; i < totalNights; i++) {
      const currentDay = new Date(parsedStartDate);
      currentDay.setDate(currentDay.getDate() + i);
      const isWeekend = [0, 6].includes(currentDay.getDay());
      totalPrice += isWeekend ? listing.weekendActualPrice : listing.weekdayActualPrice;
    }
    const paymentIntent = await stripeClient.paymentIntents.create({
      amount: totalPrice * 100, // Convert to cents
      currency: 'pkr', 
      payment_method: paymentMethodId, 
      confirm: false,
      setup_future_usage: 'off_session', // Save card info for future use

    });

    const booking = await TemporaryBooking.create({
      userId: req.user._id,
      listingId,
      startDate: parsedStartDate,
      endDate: parsedEndDate,
      guestCapacity,
      totalPrice,
      paymentIntentId: paymentIntent.id,
    });

    res.status(201).json({
      message: 'Booking created.',
      booking,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
},


confirmBooking: async (req, res) => {
  try {
    const { bookingId } = req.params;

    const temporaryBooking = await TemporaryBooking.findById(bookingId);
    if (!temporaryBooking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }
    const { listingId, startDate, endDate, userId, paymentIntentId } = temporaryBooking;
    const existingConfirmedBooking = await ConfirmedBooking.findOne({
      listingId,
      $or: [
        { startDate: { $lte: new Date(endDate) }, endDate: { $gte: new Date(startDate) } },
      ],
    });
    if (existingConfirmedBooking) {
      return res.status(400).json({ message: 'Dates already confirmed for another booking.' });
    }
    const paymentIntent = await stripeClient.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'requires_confirmation') {
      const confirmedPaymentIntent = await stripeClient.paymentIntents.confirm(paymentIntentId, {
        payment_method: paymentIntent.payment_method, 
        return_url: 'http://localhost:4000/', 

      });

      if (confirmedPaymentIntent.status === 'succeeded') {
        const confirmedBooking = await ConfirmedBooking.create({
          userId,
          listingId,
          startDate,
          endDate,
          guestCapacity: temporaryBooking.guestCapacity,
          totalPrice: temporaryBooking.totalPrice,
        });

        await TemporaryBooking.findByIdAndDelete(bookingId);

        res.status(201).json({ message: 'Booking confirmed.', confirmedBooking });
      } else {
        return res.status(400).json({ message: 'Payment not completed successfully after confirmation.' });
      }
    } else {
      return res.status(400).json({ message: 'Payment not in a valid state for confirmation.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
},



getTemporaryBookings: async (req, res) => {
  try {
    const listings = await Listing.find({ hostId: req.user._id }).select('_id');
    if (listings.length === 0) {
      return res.status(404).json({ message: 'No listings found for this host.' });
    }
    const listingIds = listings.map((listing) => listing._id);
    const bookings = await TemporaryBooking.find({ listingId: { $in: listingIds } })
      .populate('listingId')
      .exec();

    if (bookings.length === 0) {
      return res.status(200).json({ message: 'No temporary bookings found for this host.' });
    }
    const bookingsWithUserData = await Promise.all(
      bookings.map(async (booking) => {
        const userData = await Host.findById(booking.userId);

        return {
          ...booking.toObject(),
          userSpecificData: userData
            ? {
                name: userData.userName,
                email: userData.email,
                photoProfile: userData.photoProfile,
              }
            : null,
        };
      })
    );

    return res.status(200).json({ bookings: bookingsWithUserData });
  } catch (error) {
    console.error('Error fetching temporary bookings:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
},

 getBookingSummary: async (req, res) => {
  try {
    const listings = await Listing.find({ hostId: req.user._id }).select('_id');
    if (listings.length === 0) {
      return res.status(404).json({ message: 'No listings found for this host.' });
    }

    const listingIds = listings.map((listing) => listing._id);
    const allBookings = await Booking.find({ listingId: { $in: listingIds } })
      .populate('listingId')
      .lean();

    const pendingBookings = allBookings.filter((booking) => booking.status === 'pending');
    const completedBookings = allBookings.filter((booking) => booking.status === 'completed');
    const canceledBookings = allBookings.filter((booking) => booking.status === 'canceled');

    res.status(200).json({
      summary: {
        all: {
          count: allBookings.length,
          data: allBookings,
        },
        pending: {
          count: pendingBookings.length,
          data: pendingBookings,
        },
        completed: {
          count: completedBookings.length,
          data: completedBookings,
        },
        canceled: {
          count: canceledBookings.length,
          data: canceledBookings,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching booking summary:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
},


updateBookingStatus: async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;
    const validStatuses = ['pending', 'completed', 'canceled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Allowed statuses are: ${validStatuses.join(', ')}`,
      });
    }
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true, runValidators: true } 
    );
    if (!updatedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json({
      message: 'Booking status updated successfully',
      booking: updatedBooking,
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
},


  getConfirmedBookings: async (req, res) => {
    try {
      console.log("req user",req.user)
      const listings = await Listing.find({ hostId: req.user._id })
      const listingIds = listings.map((listing) => listing._id);
      const bookings = await ConfirmedBooking.find({ listingId: { $in: listingIds } }).populate('listingId');
      res.status(200).json({ bookings });
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  },



  getBookingsToday: async (req, res) => {
    try {
      const { hostId } = req.params; 
      console.log("hostId", hostId);
  
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0); 
  
      const tomorrow = new Date(today);
      tomorrow.setUTCDate(today.getUTCDate() + 1); 
  
      const listings = await Listing.find({ hostId });
      console.log("listings", listings);
  
      if (!listings || listings.length === 0) {
        return res.status(404).json({ message: 'No listings found for this hostId.' });
      }
        const todayBookings = [];
  
      listings.forEach((listing) => {
        const listingTodayBookings = listing.bookings.filter(
          (booking) => booking.bookingDate >= today && booking.bookingDate < tomorrow
        );
  
        if (listingTodayBookings.length > 0) {
          todayBookings.push({
            title: listing.title,
            bookings: listingTodayBookings,
          });
        }
      });
  
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


