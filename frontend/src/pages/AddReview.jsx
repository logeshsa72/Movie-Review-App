import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  FaStar, 
  FaArrowLeft, 
  FaUser, 
  FaPenAlt, 
  FaFilm,
  FaSpinner
} from 'react-icons/fa';

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

  useEffect(() => {
    fetchMovie();
  }, [id]);

  const fetchMovie = async () => {
    try {
      setMovieLoading(true);
      const response = await axios.get(`http://localhost:5000/api/movies/${id}`);
      setMovie(response.data.movie);
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

    if (!formData.comment.trim()) {
      setError('Please write your review');
      setLoading(false);
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/reviews', {
        movie_id: parseInt(id),
        ...formData
      });

      navigate(`/movies/${id}?review=success`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (movieLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link
            to={`/movies/${id}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            <FaArrowLeft className="mr-2" />
            Back to Movie
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                {movie?.poster_url ? (
                  <img
                    src={movie.poster_url}
                    alt={movie.title}
                    className="w-32 h-48 object-cover rounded-lg shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-48 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center shadow-lg">
                    <FaFilm className="text-4xl text-white" />
                  </div>
                )}
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-bold mb-2">Write a Review</h1>
                  <p className="text-blue-100 text-lg">Share your thoughts about</p>
                  <h2 className="text-2xl font-bold mt-1">{movie?.title}</h2>
                  <p className="text-blue-100 mt-2">
                    Directed by {movie?.director} • {movie?.release_year}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-center text-red-700">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-8">
                  <label className="block text-gray-700 mb-4 text-lg font-medium">
                    Your Rating
                  </label>
                  <div className="flex justify-center space-x-2 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                        className="text-5xl focus:outline-none transform hover:scale-110 transition-transform duration-200"
                      >
                        <FaStar
                          className={`${
                            star <= formData.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <p className="text-center text-gray-600">
                    Selected: <span className="font-bold text-yellow-600">{formData.rating}</span> out of 5 stars
                  </p>
                </div>

                <div className="mb-8">
                  <label className="flex items-center text-gray-700 mb-3 text-lg font-medium">
                    <FaUser className="mr-2 text-blue-500" />
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="reviewer_name"
                    value={formData.reviewer_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div className="mb-8">
                  <label className="flex items-center text-gray-700 mb-3 text-lg font-medium">
                    <FaPenAlt className="mr-2 text-green-500" />
                    Your Review
                  </label>
                  <textarea
                    name="comment"
                    value={formData.comment}
                    onChange={handleChange}
                    rows="6"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-lg"
                    placeholder="Share your thoughts about the movie... What did you like or dislike? Would you recommend it?"
                    required
                  />
                  <div className="text-sm text-gray-500 mt-2">
                    {formData.comment.length} characters • Minimum 20 characters recommended
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => navigate(`/movies/${id}`)}
                    className="px-8 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium text-lg"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 font-medium text-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="animate-spin mr-3" />
                        Submitting Review...
                      </>
                    ) : (
                      'Submit Review'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center">
              💡 Writing Tips
            </h3>
            <ul className="text-blue-700 space-y-2">
              <li>• Be honest about your experience</li>
              <li>• Mention what you liked or disliked</li>
              <li>• Avoid spoilers or use spoiler warnings</li>
              <li>• Keep it respectful and constructive</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddReview;