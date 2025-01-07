import mongoose from "mongoose";

const hostSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    immutable: true, 

  },
  phoneNumber:{
    type:Number,
    require:false
  },
  password: {
    type: String,
    required: true,
  },
  verifyToken: {
    type: String,
    default: '',
  },
  isVerify: {
    type: Boolean,
    default: false,
  },
  verifyCode: {
    type: String,
    default: '',
  },
  photoProfile: {
    type: String,
    default: ''
  },
  CNIC: {
    type: [String],
    validate: {
      validator: function (value) {
        return value && value.length === 2; // Ensures both front and back images are uploaded
      },
      message: 'Both front and back images of CNIC are required.',
    },
    required: true,
  },
}, {
  timestamps: true, 
});

const authentication = mongoose.model('Host', hostSchema);
export default authentication;
