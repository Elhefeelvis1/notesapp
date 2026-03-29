import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/AuthProvider';
import { AuthProvider } from './components/AuthProvider';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import NotesList from './pages/NotesList';
import EditNote from './pages/EditNote';
import Profile from './pages/Profile';
import Feed from './pages/Feed';
import Auth from './pages/Auth';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <div className=" min-h-screen bg-gray-50 pt-16 sm:pt-10 pb-10 sm:pb-0">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/notes" element={
              <ProtectedRoute>
                <NotesList />
              </ProtectedRoute>
            } />
            <Route path="/edit/:id?" element={
              <ProtectedRoute>
                <EditNote />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/feed" element={
              <ProtectedRoute>
                <Feed />
              </ProtectedRoute>
            } />
            <Route path="/login" element={<Auth />} />
            <Route path="/signup" element={<Auth />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;