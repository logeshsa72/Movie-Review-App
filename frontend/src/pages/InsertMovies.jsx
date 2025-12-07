import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AddMovieForm from './AddMovieForm';
import { 
  FaPlus, 
  FaFilm, 
  FaEdit, 
  FaTrash, 
  FaEye,
  FaSpinner,
  FaUpload,
  FaList,
  FaChartLine
} from 'react-icons/fa';

const InsertMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('browse');

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/movies');
      setMovies(response.data || []);
    } catch (err) {
      setError('Failed to fetch movies');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      try {
        await axios.delete(`http://localhost:5000/api/movies/${id}`);
        setMovies(prev => prev.filter(movie => movie.id !== id));
        setSuccess('Movie deleted successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Failed to delete movie');
      }
    }
  };

  const handleMovieAdded = (newMovie) => {
    setMovies(prev => [newMovie, ...prev]);
    setShowAddForm(false);
    setSuccess('Movie added successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const sampleMovies = [
    {
      title: "Dune: Part Two",
      description: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
      release_year: 2024,
      director: "Denis Villeneuve",
      genre: "Sci-Fi, Adventure",
      duration: 166,
      poster_url: "https://m.media-amazon.com/images/M/MV5BODI0YjNhNjUtYmU2Mi00MTVlLTkyOTYtNTE0MzYzMWQ1NjgzXkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_.jpg"
    },
    {
      title: "Oppenheimer",
      description: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
      release_year: 2023,
      director: "Christopher Nolan",
      genre: "Biography, Drama, History",
      duration: 180,
      poster_url: "https://m.media-amazon.com/images/M/MV5BMDBmYTZjNjUtN2M1MS00MTQ2LTk2ODgtNzc2M2QyZGE5NTVjXkEyXkFqcGdeQXVyNzAwMjU2MTY@._V1_.jpg"
    },
    {
      title: "Everything Everywhere All at Once",
      description: "An aging Chinese immigrant is swept up in an insane adventure where she alone can save the world.",
      release_year: 2022,
      director: "Daniel Kwan, Daniel Scheinert",
      genre: "Action, Adventure, Comedy",
      duration: 139,
      poster_url: "https://m.media-amazon.com/images/M/MV5BYTdiOTIyZTQtNmQ1OS00NjZlLWIyMTgtYzk5Y2M3ZDVmMDk1XkEyXkFqcGdeQXVyMTAzMDg4NzU0._V1_FMjpg_UX1000_.jpg"
    }
  ];

  const insertSampleMovie = async (movieData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/movies', movieData);
      setMovies(prev => [response.data, ...prev]);
      return { success: true, data: response.data };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Failed to add movie' };
    }
  };

  const insertAllSamples = async () => {
    setLoading(true);
    let successCount = 0;
    
    for (const movie of sampleMovies) {
      const result = await insertSampleMovie(movie);
      if (result.success) successCount++;
      await new Promise(resolve => setTimeout(resolve, 500)); // Delay between inserts
    }
    
    setLoading(false);
    setSuccess(`Successfully added ${successCount} sample movies!`);
    setTimeout(() => setSuccess(''), 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Add Movie Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <AddMovieForm 
            onClose={() => setShowAddForm(false)} 
            onSuccess={handleMovieAdded}
          />
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Movie Management</h1>
              <p className="text-gray-300">Add, edit, and manage movies in your collection</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/"
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center"
              >
                <FaEye className="mr-2" />
                View Public
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="container mx-auto px-4 -mt-4">
        <div className="flex space-x-1 bg-white rounded-t-xl p-1 shadow-sm">
          <button
            onClick={() => setActiveTab('browse')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${activeTab === 'browse' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <FaList className="inline mr-2" />
            Browse Movies
          </button>
          <button
            onClick={() => setActiveTab('insert')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${activeTab === 'insert' ? 'bg-green-50 text-green-600' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <FaUpload className="inline mr-2" />
            Insert Movies
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${activeTab === 'stats' ? 'bg-purple-50 text-purple-600' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <FaChartLine className="inline mr-2" />
            Statistics
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
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

        {activeTab === 'browse' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">All Movies ({movies.length})</h2>
              <button
                onClick={() => setShowAddForm(true)}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center"
              >
                <FaPlus className="mr-2" />
                Add New Movie
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <FaSpinner className="animate-spin text-4xl text-blue-500" />
              </div>
            ) : movies.length === 0 ? (
              <div className="text-center py-12">
                <FaFilm className="text-6xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-700 mb-2">No movies found</h3>
                <p className="text-gray-500 mb-6">Add your first movie to get started</p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                >
                  Add First Movie
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Movie</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Director</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reviews</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {movies.map(movie => (
                      <tr key={movie.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12 bg-gray-200 rounded-lg overflow-hidden mr-4">
                              {movie.poster_url ? (
                                <img src={movie.poster_url} alt={movie.title} className="h-full w-full object-cover" />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center">
                                  <FaFilm className="text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{movie.title}</div>
                              <div className="text-sm text-gray-500">{movie.genre}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{movie.release_year}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{movie.director}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {Number(movie.average_rating || 0).toFixed(1)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{movie.review_count || 0}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Link
                              to={`/movies/${movie.id}`}
                              className="text-blue-600 hover:text-blue-900"
                              title="View"
                            >
                              <FaEye />
                            </Link>
                            <button
                              onClick={() => handleDelete(movie.id)}
                              className="text-red-600 hover:text-red-900"
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
        )}

        {activeTab === 'insert' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Manual Add Form */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Add Movie Manually</h2>
              <p className="text-gray-600 mb-6">Fill in all the details to add a new movie to your collection.</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center text-lg font-medium"
              >
                <FaPlus className="mr-3 text-xl" />
                Open Add Movie Form
              </button>
            </div>

            {/* Sample Movies */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Add Sample Movies</h2>
              <p className="text-gray-600 mb-6">Quickly add popular movies to your collection with one click.</p>
              
              <div className="space-y-4 mb-6">
                {sampleMovies.map((movie, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-800">{movie.title}</h3>
                        <p className="text-sm text-gray-600">{movie.release_year} • {movie.director}</p>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-1">{movie.genre}</p>
                      </div>
                      <button
                        onClick={() => insertSampleMovie(movie)}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200 transition-colors"
                        disabled={loading}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={insertAllSamples}
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin mr-3" />
                    Adding Samples...
                  </>
                ) : (
                  <>
                    <FaUpload className="mr-3" />
                    Add All Sample Movies
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl">
                <div className="text-3xl font-bold text-blue-600">{movies.length}</div>
                <div className="text-gray-600">Total Movies</div>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl">
                <div className="text-3xl font-bold text-green-600">
                  {movies.reduce((sum, movie) => sum + (movie.review_count || 0), 0)}
                </div>
                <div className="text-gray-600">Total Reviews</div>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl">
                <div className="text-3xl font-bold text-purple-600">
                  {(movies.reduce((sum, movie) => sum + (parseFloat(movie.average_rating) || 0), 0) / movies.length || 0).toFixed(1)}
                </div>
                <div className="text-gray-600">Avg. Rating</div>
              </div>
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-xl">
                <div className="text-3xl font-bold text-orange-600">
                  {new Set(movies.flatMap(m => m.genre?.split(',').map(g => g.trim()))).size}
                </div>
                <div className="text-gray-600">Unique Genres</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InsertMovies;