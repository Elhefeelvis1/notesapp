import { useState } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Globe, StickyNote, User, Search, Settings } from 'lucide-react';

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
    
    // Clear the input after searching
    setSearchQuery('');
  };

  // Helper function to manage active and hover classes
  const navLinkClass = ({ isActive }) => 
    `flex items-center py-2 px-3 transition-colors ${
      isActive 
        ? "text-white bg-blue-600 rounded-xl" 
        : "text-gray-700 hover:text-white hover:rounded-xl hover:bg-blue-600"
    }`;

  const BottomNavLinkClass = ({ isActive }) => 
    `flex flex-col justify-center items-center py-1 px-3 transition-colors ${
      isActive 
        ? "text-white bg-blue-600 rounded-xl" 
        : "text-gray-700 hover:text-white hover:rounded-xl hover:bg-blue-600"
    }`;

  return (
    <>
    <header className="fixed top-0 w-full py-2 bg-white shadow-md z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-12">
        <div className="flex-shrink-0">
          <Link to="/">
            <img className="h-8 w-auto" src="/images/logo.png" alt="Logo" />
          </Link>
        </div>
        
        <div className="hidden sm:flex space-x-5">
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
    {/* Bottom Nav */}
    <div className="block sm:hidden fixed bottom-0 left-0 w-full h-16 py-2 px-6 rounded-t-[30px] flex justify-around space-x-5 bg-white shadow-[0_-3px_15px_0_rgba(0,0,0,0.3)] z-50">
      <NavLink to="/" className={BottomNavLinkClass}>
        <Home className="w-5 h-5"/>
        <span className="text-xs">Home</span>
      </NavLink>
      <NavLink to="/feed" className={BottomNavLinkClass}>
        <Globe className="w-5 h-5"/> Feeds
      </NavLink>
      <NavLink to="/notes" className={BottomNavLinkClass}>
        <StickyNote className="w-5 h-5"/> Notes
      </NavLink>
      <NavLink to="/profile" className={BottomNavLinkClass}>
        <User className="w-5 h-5"/> Profile
      </NavLink>
    </div>
    </>
  );
}