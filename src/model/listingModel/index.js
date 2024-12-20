import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
  hostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Host',
    required: true,
  },
  placeType: {
    type: String,
    enum: ['House', 'Apartment', 'Shared Room'],
    required: true,
  },
  roomType: {
    type: String,
    enum: ['Entire Place', 'A Room', 'A Shared Room'],
    required: true,
  },
  location: {
    street: { type: String, required: false },
    flat: { type: String },
    city: { type: String, required: false },
    town: { type: String },
    postcode: { type: String, required: false },
    mapLocation: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
  },
  guestCapacity: { type: Number, required: true },
  bedrooms: { type: Number, required: true },
  beds: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  amenities: [String],
  photos: [String],
  title: { type: String, required: true },
  description: { type: String, required: true },
  weekdayPrice: { type: Number, required: true },
  weekendPrice: { type: Number, required: true },
  commission: { type: Number, default: 13 },
  actualPrice: {
    type: Number,
    required: true,
    default: function () {
      return Math.round((this.weekdayPrice + this.weekendPrice) * (1 + this.commission / 100));
    },
  },
  bookings: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true },
      totalPrice: { type: Number, required: true },
    },
  ],
}, { timestamps: true });

export default mongoose.model('Listing', listingSchema);
