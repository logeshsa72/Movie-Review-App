const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController.js');
const { validateReview } = require('../middleware/validation.js');

router.post('/', validateReview, reviewController.createReview);

module.exports = router;