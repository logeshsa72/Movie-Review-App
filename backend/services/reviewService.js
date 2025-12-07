const dbService = require('./dbService');
const movieService = require('./movieService');

const reviewService = {
    createReview: async (reviewData) => {
        const { movie_id, reviewer_name, rating, comment } = reviewData;
        
        const [result] = await dbService.query(
            `INSERT INTO reviews (movie_id, reviewer_name, rating, comment) 
             VALUES (?, ?, ?, ?)`,
            [movie_id, reviewer_name, rating, comment]
        );

        // Update movie rating
        await movieService.updateMovieRating(movie_id);

        const [newReview] = await dbService.query('SELECT * FROM reviews WHERE id = ?', [result.insertId]);
        return newReview[0];
    },

    getReviewsByMovieId: async (movieId) => {
        const [reviews] = await dbService.query(
            'SELECT * FROM reviews WHERE movie_id = ? ORDER BY created_at DESC',
            [movieId]
        );
        return reviews;
    }
};

module.exports = reviewService; 