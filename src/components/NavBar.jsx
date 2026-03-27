import { useState } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Star, Globe, StickyNote, User, Search, Settings } from 'lucide-react';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Check current route to determine where to search
    if (location.pathname === '/notes') {
      // Search personal notes
      navigate(`/notes?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      // Search global feed
      navigate(`/feed?search=${encodeURIComponent(searchQuery.trim())}`);
    }
    
    // Optional: Clear the input after searching
    setSearchQuery('');
  };

  // Helper function to manage active and hover classes
  const navLinkClass = ({ isActive }) => 
    `flex items-center py-2 px-3 transition-colors ${
      isActive 
        ? "text-white bg-blue-600 rounded-xl" 
        : "text-gray-700 hover:text-white hover:rounded-xl hover:bg-blue-600"
    }`;

  return (
    <header className="fixed top-0 w-full py-2 bg-white shadow-md z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-12">
        <div className="flex-shrink-0">
          <Link to="/">
            <img className="h-8 w-auto" src="/images/logo.png" alt="Logo" />
          </Link>
        </div>
        
        <div className="hidden md:flex space-x-5">
          <NavLink to="/" className={navLinkClass} end>
            <Home className="w-5 h-5 mr-1"/> Home
          </NavLink>
          <NavLink to="/feed" className={navLinkClass}>
            <Globe className="w-5 h-5 mr-1"/> Feeds
          </NavLink>
          <NavLink to="/notes" className={navLinkClass}>
            <StickyNote className="w-5 h-5 mr-1"/> Notes
          </NavLink>
          <NavLink to="/profile" className={navLinkClass}>
            <User className="w-5 h-5 mr-1"/> Profile
          </NavLink>
        </div>

        <div className="flex items-center space-x-4">
          <form className="relative hidden sm:block" onSubmit={handleSearch}>
            <input 
              type="text" 
              placeholder="Search by tags." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-3 pr-10 py-1 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button type="submit" className="absolute right-2 top-1.5 text-gray-400 hover:text-blue-600 cursor-pointer">
              <Search className="w-4 h-4" />
            </button>
          </form>
          <Settings className="w-5 h-5 text-gray-600 cursor-pointer hover:text-blue-600" />
        </div>
      </nav>
    </header>
  );
}