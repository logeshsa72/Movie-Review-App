const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController.js');
const { validateMovie, validateReview } = require('../middleware/validation.js');

router.get('/', movieController.getAllMovies);
router.get('/:id', movieController.getMovieById);
router.post('/', validateMovie, movieController.createMovie);
router.delete('/:id', movieController.deleteMovie);

router.get('/:id/reviews', movieController.getMovieReviews);
router.post('/:id/reviews', validateReview, movieController.addReview);

module.exports = router;