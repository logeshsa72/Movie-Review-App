import { useState } from 'react';
import { useMovies } from '../context/MovieContext';
import { FaPlus, FaTrash, FaFilm, FaSignInAlt, FaSpinner } from 'react-icons/fa';
import axios from 'axios';

const AdminPanel = () => {
  // Safely destructure from context with default values
  const { movies = [], deleteMovie, addMovie } = useMovies();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [movieForm, setMovieForm] = useState({
    title: '',
    description: '',
    release_year: new Date().getFullYear(),
    director: '',
    genre: '',
    duration: 120,
    poster_url: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/admin/login', loginData);
      if (response.data.success) {
        setIsLoggedIn(true);
        setError('');
      }
    } catch (err) {
      setError('Invalid credentials');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMovieSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await addMovie(movieForm);
      if (result.success) {
        setShowAddForm(false);
        setMovieForm({
          title: '',
          description: '',
          release_year: new Date().getFullYear(),
          director: '',
          genre: '',
          duration: 120,
          poster_url: ''
        });
        setError('');
      } else {
        setError(result.error || 'Failed to add movie');
      }
    } catch (err) {
      setError('Failed to add movie');
      console.error('Add movie error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      const result = await deleteMovie(id);
      if (!result.success) {
        setError(result.error || 'Failed to delete movie');
      }
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <FaSignInAlt className="text-3xl text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Admin Login</h1>
            <p className="text-gray-600 mt-2">Enter your credentials to access the admin panel</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-6">
              <label htmlFor="username" className="block text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={loginData.username}
                onChange={(e) => setLoginData(prev => ({ ...prev, username: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter username"
                required
              />
            </div>

            <div className="mb-8">
              <label htmlFor="password" className="block text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={loginData.password}
                onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </button>
            
            <div className="mt-4 text-center text-sm text-gray-500">
              <p>Demo credentials: admin / admin123</p>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
          <p className="text-gray-600">Manage movies and reviews</p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <FaPlus className="mr-2" />
            Add Movie
          </button>
          <button
            onClick={() => setIsLoggedIn(false)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Add New Movie</h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                  disabled={loading}
                >
                  &times;
                </button>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleMovieSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={movieForm.title}
                      onChange={(e) => setMovieForm(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">
                      Director <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={movieForm.director}
                      onChange={(e) => setMovieForm(prev => ({ ...prev, director: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">
                      Release Year <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="1900"
                      max={new Date().getFullYear()}
                      value={movieForm.release_year}
                      onChange={(e) => setMovieForm(prev => ({ ...prev, release_year: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">
                      Duration (minutes) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={movieForm.duration}
                      onChange={(e) => setMovieForm(prev => ({ ...prev, duration: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-gray-700 mb-2">
                      Genre <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={movieForm.genre}
                      onChange={(e) => setMovieForm(prev => ({ ...prev, genre: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Action, Drama, Sci-Fi"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-gray-700 mb-2">
                      Poster URL
                    </label>
                    <input
                      type="url"
                      value={movieForm.poster_url}
                      onChange={(e) => setMovieForm(prev => ({ ...prev, poster_url: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com/poster.jpg"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-gray-700 mb-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={movieForm.description}
                      onChange={(e) => setMovieForm(prev => ({ ...prev, description: e.target.value }))}
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-8 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        Adding...
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

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {Array.isArray(movies) && movies.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Movie
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
                          <div className="flex-shrink-0 h-12 w-12 bg-gray-200 rounded-lg overflow-hidden mr-4">
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
                                <FaFilm className="text-gray-400 text-xl" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{movie.title || 'Untitled'}</div>
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
                        <div className="text-sm font-medium text-gray-900">
                          {(movie.average_rating || 0).toFixed(1)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{movie.review_count || 0}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleDelete(movie.id)}
                          className="text-red-600 hover:text-red-900 hover:bg-red-50 p-2 rounded transition-colors"
                          title="Delete movie"
                          disabled={loading}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Showing <span className="font-semibold">{movies.length}</span> movies
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <FaFilm className="text-6xl mx-auto" />
            </div>
            <p className="text-gray-500 text-lg mb-2">No movies found</p>
            <p className="text-gray-400 mb-6">Add your first movie using the "Add Movie" button</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaPlus className="inline mr-2" />
              Add First Movie
            </button>
          </div>
        )}
      </div>

      {error && !showAddForm && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
          <button
            onClick={() => setError('')}
            className="float-right text-red-900 hover:text-red-700"
          >
            &times;
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;