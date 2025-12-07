import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Create context with default values
const MovieContext = createContext({
  movies: [],
  loading: false,
  error: null,
  fetchMovies: () => {},
  addMovie: () => {},
  deleteMovie: () => {},
});

// Custom hook to use movie context
export const useMovies = () => {
  const context = useContext(MovieContext);
  
  // Check if context exists
  if (!context) {
    throw new Error('useMovies must be used within a MovieProvider');
  }
  
  return context;
};

// Movie provider component
export const MovieProvider = ({ children }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/movies');
      
      // Ensure response.data is an array
      const moviesData = Array.isArray(response.data) ? response.data : [];
      setMovies(moviesData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch movies');
      console.error('Error fetching movies:', err);
      setMovies([]); // Reset to empty array on error
    } finally {
      setLoading(false);
    }
  };

  const addMovie = async (movieData) => {
    try {
      const response = await axios.post('/api/movies', movieData);
      const newMovie = response.data;
      setMovies(prev => [newMovie, ...prev]);
      return { success: true, data: newMovie };
    } catch (err) {
      console.error('Error adding movie:', err);
      return { 
        success: false, 
        error: err.response?.data?.error || 'Failed to add movie' 
      };
    }
  };

  const deleteMovie = async (id) => {
    try {
      await axios.delete(`/api/movies/${id}`);
      setMovies(prev => prev.filter(movie => movie.id !== id));
      return { success: true };
    } catch (err) {
      console.error('Error deleting movie:', err);
      return { 
        success: false, 
        error: err.response?.data?.error || 'Failed to delete movie' 
      };
    }
  };

  // Fetch movies on component mount
  useEffect(() => {
    fetchMovies();
  }, []);

  // Context value
  const contextValue = {
    movies,
    loading,
    error,
    fetchMovies,
    addMovie,
    deleteMovie
  };

  return (
    <MovieContext.Provider value={contextValue}>
      {children}
    </MovieContext.Provider>
  );
};