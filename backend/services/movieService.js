const dbService = require('./dbService');

const movieService = {
    getAllMovies: async () => {
        const [movies] = await dbService.query(`
            SELECT m.*, 
                   COALESCE(AVG(r.rating), 0) as average_rating,
                   COUNT(r.id) as review_count
            FROM movies m
            LEFT JOIN reviews r ON m.id = r.movie_id
            GROUP BY m.id
            ORDER BY m.created_at DESC
        `);
        return movies;
    },

    getMovieById: async (id) => {
        const [movies] = await dbService.query('SELECT * FROM movies WHERE id = ?', [id]);
        return movies[0] || null;
    },

    createMovie: async (movieData) => {
        const { title, description, release_year, director, genre, duration, poster_url } = movieData;
        
        const [result] = await dbService.query(
            `INSERT INTO movies (title, description, release_year, director, genre, duration, poster_url) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [title, description, release_year, director, genre, duration, poster_url]
        );

        const [newMovie] = await dbService.query('SELECT * FROM movies WHERE id = ?', [result.insertId]);
        return newMovie[0];
    },

    deleteMovie: async (id) => {
        await dbService.query('DELETE FROM movies WHERE id = ?', [id]);
    },

    updateMovieRating: async (movieId) => {
        await dbService.query(`
            UPDATE movies m
            SET rating = (
                SELECT AVG(rating) 
                FROM reviews 
                WHERE movie_id = m.id
            )
            WHERE id = ?
        `, [movieId]);
    }
};

module.exports = movieService;