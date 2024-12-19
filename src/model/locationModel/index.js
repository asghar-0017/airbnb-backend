import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
  listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
  street: { type: String, required: true },
  flatFloorBuilding: { type: String },
  city: { type: String, required: true },
  town: { type: String },
  postcode: { type: String, required: true },
  coordinates: { 
    type: { type: String, default: 'Point' }, 
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

locationSchema.index({ coordinates: '2dsphere' }); // For Geo queries

const locationModel = mongoose.model('Location', locationSchema);
export default locationModel
