const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  head: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Host'
  },
  location: {
    building: String,
    floor: String,
    room: String
  },
  accessLevel: {
    type: String,
    enum: ['public', 'restricted', 'confidential'],
    default: 'public'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  visitorPolicy: {
    requiresApproval: {
      type: Boolean,
      default: true
    },
    maxVisitorsPerDay: {
      type: Number,
      default: 10
    },
    allowedVisitHours: {
      start: String, // Format: "HH:mm"
      end: String    // Format: "HH:mm"
    }
  }
}, {
  timestamps: true
});

// Indexes for better query performance
departmentSchema.index({ name: 1 });
departmentSchema.index({ code: 1 });
departmentSchema.index({ accessLevel: 1 });

const Department = mongoose.model('Department', departmentSchema);

module.exports = Department; 