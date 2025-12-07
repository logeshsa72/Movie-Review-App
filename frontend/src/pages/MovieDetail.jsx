import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaStar, FaCalendarAlt, FaClock, FaUser, FaPenAlt } from 'react-icons/fa';

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMovieDetails();
  }, [id]);

  const fetchMovieDetails = async () => {
    try {
      setLoading(true);
      const [movieRes, reviewsRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/movies/${id}`),
        axios.get(`http://localhost:5000/api/movies/${id}/reviews`)
      ]);
      
      setMovie(movieRes.data.movie);
      setReviews(reviewsRes.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch movie details');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    const safeRating = Number(rating || 0);
    return Array.from({ length: 5 }).map((_, index) => (
      <FaStar
        key={index}
        className={`w-5 h-5 ${
          index < safeRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error || 'Movie not found'}</p>
        <Link to="/" className="mt-4 inline-block text-blue-600 hover:underline">
          ← Back to movies
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/" className="inline-flex items-center text-blue-600 hover:underline mb-6">
        ← Back to movies
      </Link>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        <div className="md:flex">
          {movie.poster_url && (
            <div className="md:w-1/3">
              <img
                src={movie.poster_url}
                alt={movie.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
                }}
              />
            </div>
          )}
          
          <div className="p-8 md:w-2/3">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{movie.title}</h1>
                <div className="flex items-center space-x-4 text-gray-600 mb-4">
                  <div className="flex items-center">
                    <FaCalendarAlt className="mr-2" />
                    <span>{movie.release_year}</span>
                  </div>
                  <div className="flex items-center">
                    <FaClock className="mr-2" />
                    <span>{movie.duration} min</span>
                  </div>
                </div>
              </div>
              
              {/* ⭐ FIXED: safe Number() conversion */}
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {Number(movie.rating || 0).toFixed(1)}
                </div>
                <div className="flex justify-center mt-1">
                  {renderStars(Math.round(Number(movie.rating || 0)))}
                </div>
                <div className="text-sm text-gray-500 mt-1">Average Rating</div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Director</h3>
              <p className="text-gray-600">{movie.director}</p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Genre</h3>
              <div className="flex flex-wrap gap-2">
                {movie.genre?.split(',').map((g, idx) => (
                  <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {g.trim()}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{movie.description}</p>
            </div>

            <div className="mt-8 pt-6 border-t">
              <Link
                to={`/movies/${id}/review`}
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <FaPenAlt className="mr-2" />
                Write a Review
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Reviews ({reviews.length})</h2>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No reviews yet. Be the first to review!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map(review => (
              <div key={review.id} className="border-b pb-6 last:border-0">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <FaUser className="text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{review.reviewer_name}</h4>
                      <p className="text-sm text-gray-500">
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    {renderStars(review.rating)}
                  </div>
                </div>
                <p className="text-gray-600 mt-3">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetail;
