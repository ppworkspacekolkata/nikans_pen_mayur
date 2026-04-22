const Enquiry = require('../models/Enquiry');

// Create New Enquiry (Public)
exports.createEnquiry = async (req, res) => {
  try {
    const enquiry = new Enquiry(req.body);
    await enquiry.save();
    res.status(201).json(enquiry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all enquiries
exports.getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find()
      .populate('product', 'name skuCode mainImage')
      .sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update status (e.g. mark as Read)
exports.updateStatus = async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(enquiry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Reply to Enquiry
exports.replyEnquiry = async (req, res) => {
  try {
    const { adminReply } = req.body;
    const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, {
      adminReply,
      status: 'Responded',
      respondedAt: new Date()
    }, { new: true });
    res.json(enquiry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete Enquiry
exports.deleteEnquiry = async (req, res) => {
  try {
    await Enquiry.findByIdAndDelete(req.params.id);
    res.json({ message: 'Enquiry deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
