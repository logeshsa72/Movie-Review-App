import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaStar, FaCalendarAlt, FaClock, FaUser, FaPenAlt, FaArrowLeft } from 'react-icons/fa';
import gsap from 'gsap';

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [averageRating, setAverageRating] = useState(0);

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
      
      setMovie(movieRes.data.movie || movieRes.data);
      setReviews(reviewsRes.data || []);
      
      // Calculate average rating from reviews
      if (reviewsRes.data && reviewsRes.data.length > 0) {
        const totalRating = reviewsRes.data.reduce((sum, review) => sum + (review.rating || 0), 0);
        const avg = totalRating / reviewsRes.data.length;
        setAverageRating(avg);
      } else if (movieRes.data.movie?.average_rating) {
        setAverageRating(movieRes.data.movie.average_rating);
      } else if (movieRes.data?.average_rating) {
        setAverageRating(movieRes.data.average_rating);
      }
      
      setError(null);
      
      // Animation on load
      gsap.fromTo('.movie-detail-container', 
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      );
      
    } catch (err) {
      setError('Failed to fetch movie details');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    const safeRating = Number(rating || 0);
    const fullStars = Math.floor(safeRating);
    const hasHalfStar = safeRating % 1 >= 0.5;
    
    return (
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, index) => {
          if (index < fullStars) {
            return <FaStar key={index} className="w-5 h-5 text-yellow-400 fill-current" />;
          } else if (index === fullStars && hasHalfStar) {
            return (
              <div key={index} className="relative">
                <FaStar className="w-5 h-5 text-gray-300" />
                <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
                  <FaStar className="w-5 h-5 text-yellow-400 fill-current" />
                </div>
              </div>
            );
          } else {
            return <FaStar key={index} className="w-5 h-5 text-gray-300" />;
          }
        })}
        <span className="ml-2 text-gray-600">({Number(safeRating).toFixed(1)})</span>
      </div>
    );
  };

  const renderReviewStars = (rating) => {
    const safeRating = Number(rating || 0);
    return (
      <div className="flex">
        {Array.from({ length: 5 }).map((_, index) => (
          <FaStar
            key={index}
            className={`w-4 h-4 ${
              index < safeRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading movie details...</p>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <div className="text-center px-4">
          <div className="text-6xl mb-6">🎬</div>
          <h3 className="text-2xl font-bold mb-4">
            <span className="bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
              Movie Not Found
            </span>
          </h3>
          <p className="text-gray-400 mb-8">{error || 'The movie you\'re looking for doesn\'t exist.'}</p>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-400 to-red-500 text-black rounded-full font-bold hover:shadow-lg hover:shadow-yellow-400/30 transition-all duration-300"
          >
            <FaArrowLeft className="mr-2" />
            Back to Movies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white movie-detail-container">
      {/* Hero Section with Movie Backdrop */}
      <div 
        className="relative h-96 overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.9)), url('${movie.poster_url || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        <div className="container mx-auto px-4 h-full flex items-end pb-12 relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-end space-y-6 md:space-y-0">
            {/* Movie Poster */}
            <div className="mr-8">
              <div className="w-48 h-72 md:w-64 md:h-96 rounded-xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
                {movie.poster_url ? (
                  <img
                    src={movie.poster_url}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/400x600?text=No+Poster';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
                    <div className="text-4xl">🎬</div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Movie Info */}
            <div className="flex-1">
              <Link
                to="/"
                className="inline-flex items-center text-gray-400 hover:text-yellow-400 mb-6 transition-colors group"
              >
                <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Movies
              </Link>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                {movie.title}
                <span className="ml-4 text-gray-400 text-2xl">({movie.release_year})</span>
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center bg-gradient-to-r from-yellow-400 to-red-500 text-black px-4 py-2 rounded-full font-bold">
                  <FaStar className="mr-2" />
                  {Number(movie.average_rating || averageRating).toFixed(1)}/5.0
                </div>
                
                <div className="flex items-center text-gray-300">
                  <FaClock className="mr-2 text-yellow-400" />
                  {movie.duration} min
                </div>
                
                <div className="flex items-center text-gray-300">
                  <FaCalendarAlt className="mr-2 text-yellow-400" />
                  {movie.release_year}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genre?.split(',').map((g, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-gray-900 text-gray-300 rounded-full text-sm border border-gray-800 hover:border-yellow-400 transition-colors"
                  >
                    {g.trim()}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center text-gray-300 mb-8">
                <FaUser className="mr-2 text-yellow-400" />
                <span className="text-lg">Directed by {movie.director}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Movie Details */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 border border-gray-800 mb-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <span className="bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
                  Synopsis
                </span>
              </h2>
              <p className="text-gray-300 leading-relaxed text-lg">
                {movie.description || 'No description available.'}
              </p>
            </div>

            {/* Reviews Section */}
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 border border-gray-800">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">
                  <span className="bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
                    Reviews ({reviews.length})
                  </span>
                </h2>
                
                <Link
                  to={`/movies/${id}/review`}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-400 to-red-500 text-black rounded-full font-bold hover:shadow-lg hover:shadow-yellow-400/30 transition-all duration-300"
                >
                  <FaPenAlt className="mr-2" />
                  Write a Review
                </Link>
              </div>

              {reviews.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-6">🌟</div>
                  <h3 className="text-xl font-bold mb-4 text-gray-300">No Reviews Yet</h3>
                  <p className="text-gray-400 mb-8">Be the first to share your thoughts about this movie!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div 
                      key={review.id} 
                      className="border-b border-gray-800 pb-6 last:border-0 transform hover:scale-[1.02] transition-transform duration-300"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-red-500 rounded-full flex items-center justify-center mr-4">
                            <FaUser className="text-xl text-black" />
                          </div>
                          <div>
                            <h4 className="font-bold text-lg">{review.reviewer_name}</h4>
                            <p className="text-sm text-gray-400">
                              {new Date(review.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          {renderReviewStars(review.rating)}
                          <div className="text-lg font-bold mt-1">{review.rating}/5</div>
                        </div>
                      </div>
                      <p className="text-gray-300">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Movie Stats & Actions */}
          <div className="space-y-6">
            {/* Average Rating Card */}
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border border-gray-800">
              <div className="text-center mb-6">
                <div className="text-5xl font-bold bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
                  {Number(movie.average_rating || averageRating).toFixed(1)}
                </div>
                <div className="text-gray-400 mb-4">Average Rating</div>
                <div className="flex justify-center mb-4">
                  {renderStars(movie.average_rating || averageRating)}
                </div>
                <div className="text-sm text-gray-400">
                  Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                </div>
              </div>
              
              {reviews.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">5 stars</span>
                    <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-yellow-400 to-red-500"
                        style={{ 
                          width: `${(reviews.filter(r => r.rating === 5).length / reviews.length) * 100}%` 
                        }}
                      />
                    </div>
                  </div>
                  {/* Add similar bars for 4, 3, 2, 1 stars if needed */}
                </div>
              )}
            </div>

            {/* Movie Info Card */}
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border border-gray-800">
              <h3 className="text-xl font-bold mb-6">
                <span className="bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
                  Movie Details
                </span>
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <FaUser className="text-yellow-400 mr-3" />
                  <div>
                    <div className="text-gray-400 text-sm">Director</div>
                    <div className="font-medium">{movie.director}</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <FaClock className="text-yellow-400 mr-3" />
                  <div>
                    <div className="text-gray-400 text-sm">Duration</div>
                    <div className="font-medium">{movie.duration} minutes</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <FaCalendarAlt className="text-yellow-400 mr-3" />
                  <div>
                    <div className="text-gray-400 text-sm">Release Year</div>
                    <div className="font-medium">{movie.release_year}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border border-gray-800">
              <h3 className="text-xl font-bold mb-6">
                <span className="bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
                  Actions
                </span>
              </h3>
              
              <div className="space-y-4">
                <Link
                  to={`/movies/${id}/review`}
                  className="block w-full text-center py-3 bg-gradient-to-r from-yellow-400 to-red-500 text-black rounded-lg font-bold hover:shadow-lg hover:shadow-yellow-400/30 transition-all duration-300"
                >
                  Write Review
                </Link>
                
                <button className="w-full py-3 bg-gray-800 text-white rounded-lg font-bold hover:bg-gray-700 transition-colors duration-300 border border-gray-700">
                  Watch Trailer
                </button>
                
                <button className="w-full py-3 bg-gray-800 text-white rounded-lg font-bold hover:bg-gray-700 transition-colors duration-300 border border-gray-700">
                  Add to Watchlist
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;