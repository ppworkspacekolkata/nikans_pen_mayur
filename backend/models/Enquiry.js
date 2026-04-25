const mongoose = require('mongoose');

const EnquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  company: { type: String },
  country: { type: String },
  subject: { type: String },
  message: { type: String, required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, // Links to a specific pen
  status: { 
    type: String, 
    enum: ['New', 'Read', 'Responded', 'Spam'], 
    default: 'New' 
  },
  adminReply: { type: String },
  respondedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Enquiry', EnquirySchema);
