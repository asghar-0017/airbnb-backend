import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
  hostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Host',
    required: false,
  },
  placeType: {
    type: String,
    enum: ['House', 'Apartment', 'Shared Room'],
    required: false,
  },
  roomType: {
    type: String,
    enum: ['Entire Place', 'A Room', 'A Shared Room'],
    required: false,
  },
  location: {
    street: { type: String, required: false },
    flat: { type: String },
    city: { type: String, required: false },
    town: { type: String },
    postcode: { type: String, required: false },
    mapLocation: {
      lat: { type: Number, required: false },
      lng: { type: Number, required: false },
    },
  },
  guestCapacity: { type: Number, required: false },
  beds: { type: Number, required: false },
  bathrooms: { type: Number, required: false },
  amenities: [String],
  photos: [String],
  title: { type: String, required: false },
  description: { type: String, required: false },
  weekdayPrice: { type: Number, required: false },
  weekendPrice: { type: Number, required: false },
  commission: { type: Number, default: 13 },
  actualPrice: {
    type: Number,
    required: false,
    default: function () {
      return Math.round((this.weekdayPrice + this.weekendPrice) * (1 + this.commission / 100));
    },
  },
  bookings: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
      startDate: { type: Date, required: false },
      endDate: { type: Date, required: false },
      totalPrice: { type: Number, required: false },
    },
  ],
}, { timestamps: false });

export default mongoose.model('Listing', listingSchema);
