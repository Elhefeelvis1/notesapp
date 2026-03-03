import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/notes" element={<NotesList />} />
          <Route path="/edit/:id?" element={<EditNote />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/signup" element={<Auth />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;