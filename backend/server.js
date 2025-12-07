const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const { body, validationResult } = require('express-validator');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection()
    .then(connection => {
        console.log('✅ Database connected successfully');
        connection.release();
    })
    .catch(err => {
        console.error('❌ Database connection failed:', err);
    });

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

app.get('/api/movies', async (req, res) => {
    try {
        const [movies] = await pool.query(`
            SELECT m.*, 
                   COALESCE(AVG(r.rating), 0) as average_rating,
                   COUNT(r.id) as review_count
            FROM movies m
            LEFT JOIN reviews r ON m.id = r.movie_id
            GROUP BY m.id
            ORDER BY m.created_at DESC
        `);
        res.json(movies);
    } catch (error) {
        console.error('Error fetching movies:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/movies/:id', async (req, res) => {
    try {
        const [movies] = await pool.query('SELECT * FROM movies WHERE id = ?', [req.params.id]);
        
        if (movies.length === 0) {
            return res.status(404).json({ error: 'Movie not found' });
        }

        const [reviews] = await pool.query(
            'SELECT * FROM reviews WHERE movie_id = ? ORDER BY created_at DESC',
            [req.params.id]
        );

        res.json({
            movie: movies[0],
            reviews
        });
    } catch (error) {
        console.error('Error fetching movie:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/movies', validateMovie, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { title, description, release_year, director, genre, duration, poster_url } = req.body;
        
        const [result] = await pool.query(
            `INSERT INTO movies (title, description, release_year, director, genre, duration, poster_url) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [title, description, release_year, director, genre, duration, poster_url]
        );

        const [newMovie] = await pool.query('SELECT * FROM movies WHERE id = ?', [result.insertId]);
        
        res.status(201).json(newMovie[0]);
    } catch (error) {
        console.error('Error adding movie:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/reviews', validateReview, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { movie_id, reviewer_name, rating, comment } = req.body;
        
        const [result] = await pool.query(
            `INSERT INTO reviews (movie_id, reviewer_name, rating, comment) 
             VALUES (?, ?, ?, ?)`,
            [movie_id, reviewer_name, rating, comment]
        );

        await pool.query(`
            UPDATE movies m
            SET rating = (
                SELECT AVG(rating) 
                FROM reviews 
                WHERE movie_id = m.id
            )
            WHERE id = ?
        `, [movie_id]);

        const [newReview] = await pool.query('SELECT * FROM reviews WHERE id = ?', [result.insertId]);
        
        res.status(201).json(newReview[0]);
    } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/movies/:id/reviews', async (req, res) => {
    try {
        const [reviews] = await pool.query(
            'SELECT * FROM reviews WHERE movie_id = ? ORDER BY created_at DESC',
            [req.params.id]
        );
        res.json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/api/movies/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM movies WHERE id = ?', [req.params.id]);
        res.json({ message: 'Movie deleted successfully' });
    } catch (error) {
        console.error('Error deleting movie:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/admin/login', async (req, res) => {
    const { username, password } = req.body;
    
    if (username === 'admin' && password === 'admin123') {
        res.json({ 
            success: true, 
            message: 'Login successful',
            token: 'demo-token-123'
        });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});