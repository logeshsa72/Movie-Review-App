const movieService = require('../services/movieService.js');
const reviewService = require('../services/reviewService.js');
const { validationResult } = require('express-validator');

const movieController = {
    getAllMovies: async (req, res) => {
        try {
            const movies = await movieService.getAllMovies();
            res.json(movies);
        } catch (error) {
            console.error('Error fetching movies:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    getMovieById: async (req, res) => {
        try {
            const movieId = req.params.id;
            const movie = await movieService.getMovieById(movieId);
            
            if (!movie) {
                return res.status(404).json({ error: 'Movie not found' });
            }

            const reviews = await reviewService.getReviewsByMovieId(movieId);
            
            res.json({
                movie,
                reviews
            });
        } catch (error) {
            console.error('Error fetching movie:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    createMovie: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const movieData = req.body;
            const newMovie = await movieService.createMovie(movieData);
            res.status(201).json(newMovie);
        } catch (error) {
            console.error('Error adding movie:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    deleteMovie: async (req, res) => {
        try {
            const movieId = req.params.id;
            await movieService.deleteMovie(movieId);
            res.json({ message: 'Movie deleted successfully' });
        } catch (error) {
            console.error('Error deleting movie:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    getMovieReviews: async (req, res) => {
        try {
            const movieId = req.params.id;
            const reviews = await reviewService.getReviewsByMovieId(movieId);
            res.json(reviews);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    addReview: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const reviewData = {
                ...req.body,
                movie_id: req.params.id
            };
            const newReview = await reviewService.createReview(reviewData);
            res.status(201).json(newReview);
        } catch (error) {
            console.error('Error adding review:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = movieController;