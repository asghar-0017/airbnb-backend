import mongoose from "mongoose";

const listingSchema = new mongoose.Schema({
  hostId: { type: mongoose.Schema.Types.ObjectId, ref: 'Host', required: true },
  placeType: { 
    type: String, 
    enum: ['House', 'Apartment', 'Shared Room', 'Hostel'], 
    required: true 
  },
  roomType: { 
    type: String, 
    enum: ['Entire Place', 'A Room', 'A Shared Room'], 
    required: true 
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  weekdayPrice: { type: Number, required: true },
  weekendPrice: { type: Number, required: true },
  commissionRate: { type: Number, default: 13.00 },
  actualPrice: { 
    type: Number, 
    default: function () {
      return this.weekdayPrice - (this.weekdayPrice * this.commissionRate) / 100;
    }
  },
  photos: { 
    type: [String], 
    validate: {
      validator: function (photos) {
        return photos.length >= 3 && photos.length <= 8;
      },
      message: 'You must upload between 3 and 8 photos.',
    },
  },
  amenities: [String], // e.g., ['WiFi', 'TV', 'Kitchen']
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const ListingModel = mongoose.model('Listing', listingSchema);
export default ListingModel