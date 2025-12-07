import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FaPlus, 
  FaFilm, 
  FaTrash, 
  FaEye,
  FaSpinner,
  FaUpload,
  FaChartLine,
  FaSignOutAlt,
  FaCalendarAlt,
  FaUser,
  FaClock,
  FaTag,
  FaImage
} from 'react-icons/fa';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    release_year: new Date().getFullYear(),
    director: '',
    genre: '',
    duration: 120,
    poster_url: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [adminUsername, setAdminUsername] = useState('');

  // Check if admin is logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    const username = localStorage.getItem('adminUsername');
    
    if (!isLoggedIn || !username) {
      navigate('/admin');
      return;
    }
    
    setAdminUsername(username);
    fetchMovies();
  }, [navigate]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/movies');
      setMovies(response.data || []);
    } catch (err) {
      console.error('Error fetching movies:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminUsername');
    navigate('/admin');
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddMovie = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate form
    if (!formData.title.trim()) {
      setError('Title is required');
      setLoading(false);
      return;
    }

    if (!formData.director.trim()) {
      setError('Director is required');
      setLoading(false);
      return;
    }

    if (!formData.genre.trim()) {
      setError('Genre is required');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/movies', formData);
      
      // Add new movie to list
      setMovies(prev => [response.data, ...prev]);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        release_year: new Date().getFullYear(),
        director: '',
        genre: '',
        duration: 120,
        poster_url: ''
      });
      
      setShowAddForm(false);
      setSuccess('Movie added successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add movie');
      console.error('Add movie error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMovie = async (id) => {
    if (!window.confirm('Are you sure you want to delete this movie? This action cannot be undone.')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/movies/${id}`);
      setMovies(prev => prev.filter(movie => movie.id !== id));
      setSuccess('Movie deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete movie');
      console.error('Delete error:', err);
    }
  };

  const insertSampleMovies = async () => {
    setLoading(true);
    setError('');
    
    const sampleMovies = [
      {
        title: "Avatar: The Way of Water",
        description: "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora.",
        release_year: 2022,
        director: "James Cameron",
        genre: "Action, Adventure, Fantasy",
        duration: 192,
        poster_url: "https://m.media-amazon.com/images/M/MV5BYjhiNjBlODctY2ZiOC00YjVlLWFlNzAtNTVhNzM1YjI1NzMxXkEyXkFqcGdeQXVyMjQxNTE1MDA@._V1_.jpg"
      },
      {
        title: "Top Gun: Maverick",
        description: "After thirty years, Maverick is still pushing the envelope as a top naval aviator.",
        release_year: 2022,
        director: "Joseph Kosinski",
        genre: "Action, Drama",
        duration: 130,
        poster_url: "https://m.media-amazon.com/images/M/MV5BZWYzOGEwNTgtNWU3NS00ZTQ0LWJkODUtMmVhMjIwMjA1ZmQwXkEyXkFqcGdeQXVyMjkwOTAyMDU@._V1_.jpg"
      },
      {
        title: "Spider-Man: No Way Home",
        description: "With Spider-Man's identity now revealed, Peter asks Doctor Strange for help.",
        release_year: 2021,
        director: "Jon Watts",
        genre: "Action, Adventure, Fantasy",
        duration: 148,
        poster_url: "https://m.media-amazon.com/images/M/MV5BZWMyYzFjYTYtNTRjYi00OGExLWE2YzgtOGRmYjAxZTU3NzBiXkEyXkFqcGdeQXVyMzQ0MzA0NTM@._V1_.jpg"
      }
    ];

    let successCount = 0;
    let errors = [];

    for (const movie of sampleMovies) {
      try {
        const response = await axios.post('http://localhost:5000/api/movies', movie);
        setMovies(prev => [response.data, ...prev]);
        successCount++;
        await new Promise(resolve => setTimeout(resolve, 500)); // Delay between requests
      } catch (err) {
        errors.push(`Failed to add "${movie.title}"`);
      }
    }

    setLoading(false);
    
    if (successCount > 0) {
      setSuccess(`Successfully added ${successCount} sample movies!`);
    }
    
    if (errors.length > 0) {
      setError(errors.join(', '));
    }
    
    setTimeout(() => {
      setSuccess('');
      setError('');
    }, 5000);
  };

  if (loading && movies.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-2xl p-8 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Welcome, <span className="text-blue-300">{adminUsername}</span>
            </h1>
            <p className="text-gray-300">Manage your movie collection and add new films</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center"
            >
              <FaEye className="mr-2" />
              View Public Site
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors flex items-center"
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-center text-green-700">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {success}
          </div>
        </div>
      )}

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

      {/* Add Movie Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800">Add New Movie</h2>
                  <p className="text-gray-600 mt-2">Fill in the movie details below</p>
                </div>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                  disabled={loading}
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleAddMovie}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Title */}
                  <div className="md:col-span-2">
                    <label className="flex items-center text-gray-700 mb-2 font-medium">
                      <FaFilm className="mr-2 text-blue-500" />
                      Movie Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter movie title"
                      required
                    />
                  </div>

                  {/* Director */}
                  <div>
                    <label className="flex items-center text-gray-700 mb-2 font-medium">
                      <FaUser className="mr-2 text-purple-500" />
                      Director *
                    </label>
                    <input
                      type="text"
                      name="director"
                      value={formData.director}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter director name"
                      required
                    />
                  </div>

                  {/* Release Year */}
                  <div>
                    <label className="flex items-center text-gray-700 mb-2 font-medium">
                      <FaCalendarAlt className="mr-2 text-green-500" />
                      Release Year *
                    </label>
                    <input
                      type="number"
                      name="release_year"
                      value={formData.release_year}
                      onChange={handleFormChange}
                      min="1900"
                      max={new Date().getFullYear()}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="flex items-center text-gray-700 mb-2 font-medium">
                      <FaClock className="mr-2 text-orange-500" />
                      Duration (minutes) *
                    </label>
                    <input
                      type="number"
                      name="duration"
                      value={formData.duration}
                      onChange={handleFormChange}
                      min="1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Genre */}
                  <div>
                    <label className="flex items-center text-gray-700 mb-2 font-medium">
                      <FaTag className="mr-2 text-pink-500" />
                      Genre *
                    </label>
                    <input
                      type="text"
                      name="genre"
                      value={formData.genre}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Action, Drama, Sci-Fi"
                      required
                    />
                  </div>

                  {/* Poster URL */}
                  <div>
                    <label className="flex items-center text-gray-700 mb-2 font-medium">
                      <FaImage className="mr-2 text-teal-500" />
                      Poster URL
                    </label>
                    <input
                      type="url"
                      name="poster_url"
                      value={formData.poster_url}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com/poster.jpg"
                    />
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 mb-2 font-medium">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleFormChange}
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Enter movie description..."
                      required
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end space-x-4 mt-8 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        Adding Movie...
                      </>
                    ) : (
                      'Add Movie'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Add Movie Card */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-blue-500 rounded-lg text-white mr-4">
              <FaPlus className="text-xl" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Add New Movie</h3>
              <p className="text-blue-600">Manually add a movie</p>
            </div>
          </div>
          <p className="text-gray-600 mb-6">Add a new movie to your collection with full details.</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
          >
            <FaPlus className="inline mr-2" />
            Add Movie
          </button>
        </div>

      

        {/* Statistics Card */}
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-2xl p-6">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-purple-500 rounded-lg text-white mr-4">
              <FaChartLine className="text-xl" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Statistics</h3>
              <p className="text-purple-600">Collection overview</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Movies:</span>
              <span className="font-bold text-purple-600">{movies.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Reviews:</span>
              <span className="font-bold text-purple-600">
                {movies.reduce((sum, movie) => sum + (movie.review_count || 0), 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Avg Rating:</span>
              <span className="font-bold text-purple-600">
                {(movies.reduce((sum, movie) => sum + (parseFloat(movie.average_rating) || 0), 0) / movies.length || 0).toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Movies List */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Movie Collection</h2>
              <p className="text-gray-600">Manage all movies in your collection</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-500">Total:</span>
              <span className="font-bold text-blue-600">{movies.length} movies</span>
            </div>
          </div>
        </div>

        {movies.length === 0 ? (
          <div className="text-center py-12">
            <FaFilm className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">No movies yet</h3>
            <p className="text-gray-500 mb-6">Start by adding your first movie</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
            >
              <FaPlus className="inline mr-2" />
              Add First Movie
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Movie Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Year
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Director
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reviews
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {movies.map(movie => (
                  <tr key={movie.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-16 w-12 bg-gray-200 rounded-lg overflow-hidden mr-4">
                          {movie.poster_url ? (
                            <img
                              src={movie.poster_url}
                              alt={movie.title}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/100x150?text=No+Image';
                              }}
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                              <FaFilm className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{movie.title || 'Untitled'}</div>
                          <div className="text-sm text-gray-500">
                            {movie.genre?.split(',').slice(0, 2).join(', ') || 'No genre'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{movie.release_year || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{movie.director || 'Unknown'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">
                        {Number(movie.average_rating || 0).toFixed(1)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{movie.review_count || 0}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => window.open(`/movies/${movie.id}`, '_blank')}
                          className="text-blue-600 hover:text-blue-900 hover:bg-blue-50 p-2 rounded transition-colors"
                          title="View"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => handleDeleteMovie(movie.id)}
                          className="text-red-600 hover:text-red-900 hover:bg-red-50 p-2 rounded transition-colors"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;