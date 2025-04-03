const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  purpose: {
    type: String,
    required: true,
    trim: true
  },
  host: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    department: {
      type: String,
      required: true,
      trim: true
    }
  },
  status: {
    type: String,
    enum: ['scheduled', 'checked-in', 'checked-out'],
    default: 'scheduled'
  },
  checkIn: {
    type: Date
  },
  checkOut: {
    type: Date
  },
  expectedArrival: {
    type: Date,
    required: true
  },
  expectedDeparture: {
    type: Date,
    required: true
  },
  qrCode: {
    type: String,
    unique: true
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for faster queries
visitorSchema.index({ email: 1 });
visitorSchema.index({ status: 1 });
visitorSchema.index({ qrCode: 1 });

const Visitor = mongoose.model('Visitor', visitorSchema);

module.exports = Visitor; 