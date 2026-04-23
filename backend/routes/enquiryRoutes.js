const express = require('express');
const router = express.Router();
const enquiryController = require('../controllers/enquiryController');

router.get('/', enquiryController.getAllEnquiries);
router.post('/', enquiryController.createEnquiry);
router.put('/:id/status', enquiryController.updateEnquiryStatus);
router.put('/:id/reply', enquiryController.addAdminReply);
router.delete('/:id', enquiryController.deleteEnquiry);

module.exports = router;
