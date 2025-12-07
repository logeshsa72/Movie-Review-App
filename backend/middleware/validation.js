const { body } = require('express-validator');

const validateMovie = [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('release_year').isInt({ min: 1900, max: new Date().getFullYear() }),
    body('director').notEmpty(),
    body('genre').notEmpty()
];

const validateReview = [
    body('movie_id').isInt(),
    body('reviewer_name').notEmpty().withMessage('Reviewer name is required'),
    body('rating').isInt({ min: 1, max: 5 }),
    body('comment').notEmpty().withMessage('Comment is required')
];

module.exports = {
    validateMovie,
    validateReview
};