const Enquiry = require('../models/Enquiry');

exports.getAllEnquiries = async (req, res) => {
  try {
    const list = await Enquiry.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createEnquiry = async (req, res) => {
  try {
    const enquiry = new Enquiry(req.body);
    await enquiry.save();
    res.status(201).json(enquiry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateEnquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(enquiry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.addAdminReply = async (req, res) => {
  try {
    const { adminReply } = req.body;
    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id, 
      { adminReply, status: 'Resolved' }, 
      { new: true }
    );
    res.json(enquiry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteEnquiry = async (req, res) => {
  try {
    await Enquiry.findByIdAndDelete(req.params.id);
    res.json({ message: 'Enquiry deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
