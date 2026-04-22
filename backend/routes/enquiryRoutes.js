const express = require('express');
const router = express.Router();
const { getAllEnquiries, updateStatus, replyEnquiry, deleteEnquiry, createEnquiry } = require('../controllers/enquiryController');

router.post('/', createEnquiry);
router.get('/', getAllEnquiries);
router.put('/:id/status', updateStatus);
router.put('/:id/reply', replyEnquiry);
router.delete('/:id', deleteEnquiry);

module.exports = router;
