const reviewService = require('../services/reviewService');
const { validationResult } = require('express-validator');

const reviewController = {
    createReview: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const reviewData = req.body;
            const newReview = await reviewService.createReview(reviewData);
            res.status(201).json(newReview);
        } catch (error) {
            console.error('Error adding review:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = reviewController;