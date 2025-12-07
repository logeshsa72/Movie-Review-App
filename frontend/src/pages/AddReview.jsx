import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import gsap from 'gsap';
import { 
  FaStar, 
  FaArrowLeft, 
  FaUser, 
  FaPenAlt, 
  FaFilm,
  FaSpinner,
  FaQuoteLeft,
  FaQuoteRight,
  FaMagic,
  FaCheck
} from 'react-icons/fa';
import { GiFilmSpool } from 'react-icons/gi';

const AddReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [movieLoading, setMovieLoading] = useState(true);
  const [formData, setFormData] = useState({
    reviewer_name: '',
    rating: 5,
    comment: ''
  });
  const [error, setError] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);

  useEffect(() => {
    fetchMovie();
    initAnimations();
  }, [id]);

  const initAnimations = () => {
    gsap.fromTo('.review-container', 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    );
    
    gsap.fromTo('.floating-icon', 
      { y: 0 },
      { 
        y: -15,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      }
    );
  };

  const fetchMovie = async () => {
    try {
      setMovieLoading(true);
      const response = await axios.get(`http://localhost:5000/api/movies/${id}`);
      setMovie(response.data.movie || response.data);
    } catch (err) {
      console.error('Error fetching movie:', err);
    } finally {
      setMovieLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (name === 'comment') {
      setCharacterCount(value.length);
    }
  };

  const handleRatingHover = (rating) => {
    setHoverRating(rating);
  };

  const handleRatingClick = (rating) => {
    setFormData(prev => ({ ...prev, rating }));
    
    gsap.fromTo(`.star-${rating}`, 
      { scale: 1 },
      { 
        scale: 1.5, 
        duration: 0.3,
        ease: 'back.out(2)',
        yoyo: true,
        repeat: 1
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.reviewer_name.trim()) {
      setError('Please enter your name');
      setLoading(false);
      return;
    }

    if (!formData.comment.trim() || formData.comment.length < 20) {
      setError('Please write a review with at least 20 characters');
      setLoading(false);
      return;
    }

    try {
      gsap.to('.submit-btn', {
        scale: 0.95,
        duration: 0.2,
        onComplete: async () => {
          await axios.post('http://localhost:5000/api/reviews', {
            movie_id: parseInt(id),
            ...formData
          });

          // Success animation
          gsap.to('.success-animation', {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            ease: 'back.out(1.7)',
            onComplete: () => {
              setTimeout(() => {
                navigate(`/movies/${id}?review=success`);
              }, 1500);
            }
          });
        }
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit review. Please try again.');
      setLoading(false);
    }
  };

  if (movieLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-yellow-400/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <GiFilmSpool className="absolute inset-0 text-yellow-400 animate-spin" style={{ animationDuration: '3s' }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <FaPenAlt className="text-red-500 text-2xl" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold mb-4">
            <span className="bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent animate-pulse">
              Loading Movie Details...
            </span>
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <div className="fixed inset-0 -z-10">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.9)), url('${movie?.poster_url || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(8px)'
          }}
        />
        
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400/10 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      <div className="success-animation fixed inset-0 flex items-center justify-center bg-black/90 z-50 opacity-0 scale-0">
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-red-500 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
            <div className="absolute inset-4 bg-black rounded-full flex items-center justify-center">
              <FaCheck className="text-5xl text-yellow-400" />
            </div>
          </div>
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
              Review Submitted!
            </span>
          </h2>
          <p className="text-gray-400 text-xl">Redirecting to movie page...</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 review-container">
        <div className="mb-8">
          <Link
            to={`/movies/${id}`}
            className="inline-flex items-center text-gray-400 hover:text-yellow-400 transition-colors group mb-6"
          >
            <div className="p-2 bg-gray-900 rounded-lg mr-3 group-hover:bg-yellow-400/20 transition-colors">
              <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            </div>
            <span className="text-lg">Back to Movie</span>
          </Link>

          <div className="text-center mb-12">
            <div className="inline-block mb-4 floating-icon">
              <div className="p-4 bg-gradient-to-r from-yellow-400 to-red-500 rounded-2xl rotate-12">
                <FaPenAlt className="text-2xl text-black" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-yellow-400 via-red-500 to-purple-500 bg-clip-text text-transparent animate-gradient">
                Share Your Review
              </span>
            </h1>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto">
              Your opinion matters! Share your thoughts about this cinematic masterpiece.
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl rounded-3xl border border-gray-800 p-8 mb-8 transform hover:scale-[1.02] transition-all duration-500">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative">
                {movie?.poster_url ? (
                  <img
                    src={movie.poster_url}
                    alt={movie.title}
                    className="w-48 h-64 object-cover rounded-xl shadow-2xl"
                  />
                ) : (
                  <div className="w-48 h-64 bg-gradient-to-br from-gray-900 to-black rounded-xl flex items-center justify-center shadow-2xl">
                    <FaFilm className="text-5xl text-gray-700" />
                  </div>
                )}
                <div className="absolute -bottom-3 -right-3 w-16 h-16 bg-gradient-to-r from-yellow-400 to-red-500 rounded-full flex items-center justify-center shadow-xl">
                  <span className="text-black font-bold text-xl">★</span>
                </div>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <div className="mb-2">
                  <span className="px-4 py-1 bg-gray-800 text-gray-300 rounded-full text-sm">
                    Reviewing
                  </span>
                </div>
                <h2 className="text-3xl font-bold mb-2">{movie?.title}</h2>
                <div className="flex flex-wrap items-center gap-4 text-gray-400 mb-4">
                  <span className="flex items-center">
                    <FaFilm className="mr-2 text-yellow-400" />
                    {movie?.director}
                  </span>
                  <span>•</span>
                  <span>{movie?.release_year}</span>
                  <span>•</span>
                  <span>{movie?.duration} min</span>
                </div>
                <p className="text-gray-400 line-clamp-3">
                  {movie?.description || 'An incredible cinematic experience awaits your review.'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl rounded-3xl border border-gray-800 p-8 shadow-2xl">
            {error && (
              <div className="mb-8 p-6 bg-gradient-to-r from-red-900/30 to-red-800/20 border border-red-800 rounded-2xl animate-pulse">
                <div className="flex items-center text-red-400">
                  <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-lg font-medium">{error}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-12">
              <div className="text-center">
                <div className="inline-flex items-center mb-6 px-6 py-3 bg-gray-900 rounded-full">
                  <FaStar className="text-yellow-400 mr-3 text-xl" />
                  <h2 className="text-2xl font-bold">Your Rating</h2>
                </div>
                
                <div className="flex justify-center space-x-1 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      className={`star-${star} transform transition-all duration-300 hover:scale-125 ${
                        star <= (hoverRating || formData.rating) ? 'text-yellow-400' : 'text-gray-700'
                      }`}
                      onMouseEnter={() => handleRatingHover(star)}
                      onMouseLeave={() => handleRatingHover(0)}
                      onClick={() => handleRatingClick(star)}
                    >
                      <FaStar className="text-6xl md:text-7xl" />
                    </button>
                  ))}
                </div>
                
                <div className="flex items-center justify-center space-x-4">
                  <span className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
                    {formData.rating}.0
                  </span>
                  <span className="text-gray-400 text-xl">/ 5.0</span>
                  <div className="h-8 w-1 bg-gradient-to-b from-yellow-400 to-red-500" />
                  <div className="flex items-center text-gray-400">
                    <span className="text-2xl mr-2">{['😞', '😐', '😊', '😄', '🤩'][formData.rating - 1]}</span>
                    <span className="text-lg">{['Poor', 'Fair', 'Good', 'Great', 'Excellent'][formData.rating - 1]}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="flex items-center text-xl font-bold mb-6">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-xl mr-4">
                    <FaUser className="text-black" />
                  </div>
                  <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                    Your Name
                  </span>
                </label>
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity" />
                  <input
                    type="text"
                    name="reviewer_name"
                    value={formData.reviewer_name}
                    onChange={handleChange}
                    className="relative w-full px-6 py-4 bg-gray-900/50 border border-gray-700 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50 backdrop-blur-sm"
                    placeholder="Enter your name or username"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center text-xl font-bold mb-6">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mr-4">
                    <FaPenAlt className="text-black" />
                  </div>
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Your Review
                  </span>
                </label>
                
                <div className="relative mb-4">
                  <FaQuoteLeft className="absolute top-4 left-4 text-gray-700 text-2xl" />
                  <FaQuoteRight className="absolute bottom-4 right-4 text-gray-700 text-2xl" />
                  
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity" />
                    <textarea
                      name="comment"
                      value={formData.comment}
                      onChange={handleChange}
                      rows="8"
                      className="relative w-full px-6 py-8 bg-gray-900/50 border border-gray-700 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-purple-400/50 backdrop-blur-sm resize-none"
                      placeholder="Share your cinematic experience... What did you love? What could be improved? Would you recommend it?"
                      required
                    />
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className={`text-sm font-medium ${
                    characterCount < 20 ? 'text-red-400' : 
                    characterCount < 100 ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    {characterCount} characters • Minimum 20 characters
                  </div>
                  <div className="flex items-center text-gray-400">
                    <FaMagic className="mr-2" />
                    <span>Be honest & constructive</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-gray-900 to-black border border-gray-800 rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <div className="p-2 bg-gradient-to-r from-yellow-400 to-red-500 rounded-lg mr-3">
                    <FaStar className="text-black" />
                  </div>
                  <span className="bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
                    Writing Tips
                  </span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3 p-3 bg-gray-900/50 rounded-lg">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <span className="text-blue-400">✓</span>
                    </div>
                    <span className="text-gray-300">Be specific about what you liked</span>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-gray-900/50 rounded-lg">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <span className="text-green-400">✓</span>
                    </div>
                    <span className="text-gray-300">Avoid spoilers or use warnings</span>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-gray-900/50 rounded-lg">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <span className="text-purple-400">✓</span>
                    </div>
                    <span className="text-gray-300">Consider acting, direction, and cinematography</span>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-gray-900/50 rounded-lg">
                    <div className="p-2 bg-red-500/20 rounded-lg">
                      <span className="text-red-400">✓</span>
                    </div>
                    <span className="text-gray-300">Keep it respectful and constructive</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-6 pt-8 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => navigate(`/movies/${id}`)}
                  disabled={loading}
                  className="px-10 py-4 border border-gray-700 text-gray-400 rounded-xl hover:bg-gray-900 hover:text-white hover:border-gray-600 transition-all duration-300 font-bold text-lg group flex items-center justify-center"
                >
                  <FaArrowLeft className="mr-3 group-hover:-translate-x-1 transition-transform" />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="submit-btn px-12 py-4 bg-gradient-to-r from-yellow-400 to-red-500 text-black rounded-xl hover:shadow-2xl hover:shadow-yellow-400/30 transition-all duration-300 font-bold text-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin mr-3 text-xl" />
                      Publishing Review...
                    </>
                  ) : (
                    <>
                      <FaStar className="mr-3 group-hover:rotate-12 transition-transform" />
                      Submit Review
                      <div className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        🚀
                      </div>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-500">
              Your review will help others discover great movies. Thank you for sharing! ✨
            </p>
          </div>
        </div>
      </div>

      <div className="fixed inset-0 pointer-events-none -z-10">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-red-500 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${4 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default AddReview;