import mongoose from 'mongoose';

const confirmedBookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  guestCapacity: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'completed', 'canceled'],
    default: 'pending', 
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('ConfirmedBooking', confirmedBookingSchema);
