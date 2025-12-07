import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MovieList from './pages/MovieList.jsx';
import MovieDetail from './pages/MovieDetail.jsx';
import AddReview from './pages/AddReview.jsx';
import AdminPanel from './pages/AdminPanel.jsx';
import Navbar from './components/Navbar.jsx';
import { MovieProvider } from './context/MovieContext.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';

function App() {
  return (
    <MovieProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <ErrorBoundary>
              <Routes>
                <Route path="/" element={<MovieList />} />
                <Route path="/movies/:id" element={<MovieDetail />} />
                <Route path="/movies/:id/review" element={<AddReview />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </ErrorBoundary>
          </main>
        </div>
      </Router>
    </MovieProvider>
  );
}

export default App;