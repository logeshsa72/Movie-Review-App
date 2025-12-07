import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  FaStar, 
  FaEye, 
  FaComment, 
  FaCalendarAlt, 
  FaClock, 
  FaSearch, 
  FaFilter,
  FaSortAmountDown,
  FaSortAmountUp,
  FaHeart,
  FaPlayCircle,
  FaSpinner
} from 'react-icons/fa';
import { GiPopcorn } from 'react-icons/gi';

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [sortBy, setSortBy] = useState('rating');
  const [sortOrder, setSortOrder] = useState('desc');
  const [hoveredMovie, setHoveredMovie] = useState(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/movies');
      console.log(response.data, "API Response");
      setMovies(response.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch movies. Please check if the backend is running.');
      console.error('Error fetching movies:', err);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  // Generate placeholder image based on movie title
  const generatePlaceholderImage = (title) => {
    const colors = [
      'bg-gradient-to-r from-blue-500 to-purple-600',
      'bg-gradient-to-r from-red-500 to-pink-600',
      'bg-gradient-to-r from-green-500 to-teal-600',
      'bg-gradient-to-r from-yellow-500 to-orange-600',
      'bg-gradient-to-r from-indigo-500 to-blue-600',
      'bg-gradient-to-r from-purple-500 to-pink-600',
      'bg-gradient-to-r from-pink-500 to-rose-600',
      'bg-gradient-to-r from-teal-500 to-cyan-600',
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const initials = title
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
    
    return (
      <div className={`${randomColor} w-full h-64 flex items-center justify-center text-white`}>
        <div className="text-center">
          <GiPopcorn className="text-5xl mb-2 opacity-75" />
          <div className="text-2xl font-bold">{initials}</div>
        </div>
      </div>
    );
  };

  // Safely extract genres from movies
  const genres = ['All'];
  if (Array.isArray(movies)) {
    movies.forEach(movie => {
      if (movie.genre) {
        const movieGenres = movie.genre.split(',').map(g => g.trim());
        movieGenres.forEach(g => {
          if (g && !genres.includes(g)) {
            genres.push(g);
          }
        });
      }
    });
  }

  // Filter movies
  const filteredMovies = (Array.isArray(movies) ? movies : []).filter(movie => {
    if (!movie || typeof movie !== 'object') return false;

    const title = movie.title || '';
    const director = movie.director || '';
    const genre = movie.genre || '';

    const matchesSearch =
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      director.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGenre = selectedGenre === 'All' ||
      genre.includes(selectedGenre);

    return matchesSearch && matchesGenre;
  });

  // Sort movies
  const sortedMovies = [...filteredMovies].sort((a, b) => {
    let valueA, valueB;
    
    switch(sortBy) {
      case 'rating':
        valueA = parseFloat(a.average_rating) || 0;
        valueB = parseFloat(b.average_rating) || 0;
        break;
      case 'year':
        valueA = parseInt(a.release_year) || 0;
        valueB = parseInt(b.release_year) || 0;
        break;
      case 'title':
        valueA = (a.title || '').toLowerCase();
        valueB = (b.title || '').toLowerCase();
        break;
      case 'reviews':
        valueA = parseInt(a.review_count) || 0;
        valueB = parseInt(b.review_count) || 0;
        break;
      default:
        return 0;
    }
    
    if (sortOrder === 'desc') {
      return valueB - valueA;
    } else {
      return valueA - valueB;
    }
  });

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-center">
          <GiPopcorn className="text-6xl text-blue-500 mb-4 animate-bounce" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Loading Movies</h2>
          <p className="text-gray-500">Fetching your cinematic experience...</p>
          <div className="mt-6">
            <FaSpinner className="animate-spin text-4xl text-blue-500 mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-4">
          <div className="text-6xl mb-4">🎬</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex space-x-3 justify-center">
            <button
              onClick={fetchMovies}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center"
            >
              <FaPlayCircle className="mr-2" />
              Retry
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-12 mb-12 rounded-b-3xl">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Discover Cinematic Masterpieces
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Explore, rate, and review your favorite movies. Join our community of film enthusiasts.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search movies, directors, or genres..."
                className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-300">
                    {filteredMovies.length} movies
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
          {/* Stats Footer */}
        {sortedMovies.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-2xl">
                <div className="text-3xl font-bold text-blue-600">{movies.length}</div>
                <div className="text-gray-600">Total Movies</div>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-2xl">
                <div className="text-3xl font-bold text-purple-600">
                  {movies.reduce((sum, movie) => sum + (movie.review_count || 0), 0)}
                </div>
                <div className="text-gray-600">Total Reviews</div>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-2xl">
                <div className="text-3xl font-bold text-green-600">
                  {(movies.reduce((sum, movie) => sum + (parseFloat(movie.average_rating) || 0), 0) / movies.length || 0).toFixed(1)}
                </div>
                <div className="text-gray-600">Average Rating</div>
              </div>
              <div className="bg-gradient-to-r from-pink-50 to-pink-100 p-6 rounded-2xl">
                <div className="text-3xl font-bold text-pink-600">
                  {genres.length - 1}
                </div>
                <div className="text-gray-600">Genres</div>
              </div>
            </div>
          </div>
        )}

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-12">
        {/* Filters & Sort Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800">
              Featured Movies
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({sortedMovies.length} {sortedMovies.length === 1 ? 'movie' : 'movies'})
              </span>
            </h2>
            <p className="text-gray-600">Handpicked collection of must-watch films</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {/* Genre Filter */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <FaFilter className="text-gray-400" />
              </div>
              <select
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none"
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
              >
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>
            
            {/* Sort By */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <FaSortAmountDown className="text-gray-400" />
              </div>
              <select
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="rating">Highest Rated</option>
                <option value="year">Release Year</option>
                <option value="title">Title A-Z</option>
                <option value="reviews">Most Reviews</option>
              </select>
            </div>
            
            {/* Sort Order Toggle */}
            <button
              onClick={toggleSortOrder}
              className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors flex items-center"
              title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
            >
              {sortOrder === 'desc' ? (
                <FaSortAmountDown className="text-gray-600" />
              ) : (
                <FaSortAmountUp className="text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Movies Grid */}
        {sortedMovies.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎬</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No movies found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm 
                ? `No results for "${searchTerm}"`
                : 'No movies available. Check back soon!'}
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedGenre('All');
              }}
              className="px-6 py-2 text-blue-600 hover:text-blue-700 hover:underline font-medium"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {sortedMovies.map(movie => (
              <div 
                key={movie.id} 
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-1"
                onMouseEnter={() => setHoveredMovie(movie.id)}
                onMouseLeave={() => setHoveredMovie(null)}
              >
                {/* Movie Poster */}
                <div className="relative overflow-hidden h-64">
                  {movie.poster_url ? (
                    <img
                      src={movie.poster_url}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.parentElement.innerHTML = '';
                        e.target.parentElement.appendChild(generatePlaceholderImage(movie.title || 'Movie'));
                      }}
                    />
                  ) : (
                    generatePlaceholderImage(movie.title || 'Movie')
                  )}
                  
                  {/* Rating Badge */}
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg flex items-center">
                    <FaStar className="mr-1" />
                    <span>{Number(movie.average_rating ?? 0).toFixed(1)}</span>
                  </div>
                  
                  {/* Hover Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-300 ${
                    hoveredMovie === movie.id ? 'opacity-100' : 'opacity-0'
                  }`}>
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <Link
                        to={`/movies/${movie.id}`}
                        className="block w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-center rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Movie Info */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {movie.title || 'Untitled'}
                    </h3>
                    <button className="text-gray-400 hover:text-red-500 transition-colors">
                      <FaHeart />
                    </button>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
                    {movie.description || 'No description available'}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <FaCalendarAlt className="mr-2 flex-shrink-0" />
                      <span className="truncate">{movie.release_year || 'N/A'}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <FaClock className="mr-2 flex-shrink-0" />
                      <span>{movie.duration || 'N/A'} min</span>
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                      <span className="font-medium">Director:</span> {movie.director || 'Unknown'}
                    </div>
                  </div>

                  {/* Genres */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {movie.genre?.split(',').slice(0, 3).map((g, idx) => (
                      <span 
                        key={idx} 
                        className="px-3 py-1 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 rounded-full text-xs font-medium"
                      >
                        {g.trim()}
                      </span>
                    ))}
                    {movie.genre?.split(',').length > 3 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                        +{movie.genre?.split(',').length - 3}
                      </span>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div className="flex items-center text-sm text-gray-500">
                      <FaComment className="mr-2" />
                      <span>{movie.review_count || 0} {movie.review_count === 1 ? 'review' : 'reviews'}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        to={`/movies/${movie.id}`}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 text-sm font-medium flex items-center group-hover:px-6"
                      >
                        <FaEye className="mr-2" />
                        Watch
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

    
      </div>
    </div>
  );
};

export default MovieList;