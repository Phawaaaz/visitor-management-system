const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    trim: true
  },
  purpose: {
    type: String,
    required: true,
    trim: true
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Host',
    required: true
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  qrCode: {
    type: String,
    unique: true
  },
  qrCodeExpiry: {
    type: Date
  },
  status: {
    type: String,
    enum: ['pending', 'checked-in', 'checked-out', 'cancelled'],
    default: 'pending'
  },
  checkInTime: {
    type: Date
  },
  checkOutTime: {
    type: Date
  },
  documents: [{
    type: String // URLs to uploaded documents
  }],
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
visitorSchema.index({ email: 1 });
visitorSchema.index({ qrCode: 1 });
visitorSchema.index({ status: 1 });

const Visitor = mongoose.model('Visitor', visitorSchema);

module.exports = Visitor; 