import { Link } from 'react-router-dom';
import { Home, Star, Globe, StickyNote, User, Search, Settings } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="fixed top-0 w-full bg-white shadow-md z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <div className="flex-shrink-0">
          <Link to="/"><img className="h-8 w-auto" src="/images/logo.png" alt="Logo" /></Link>
        </div>
        
        <div className="hidden md:flex space-x-5">
          <Link to="/" className="flex items-center text-gray-700 py-2 px-3 hover:text-white hover:rounded-xl hover:bg-blue-600"><Home className="w-5 h-5 mr-1"/> Home</Link>
          <Link to="/feed" className="flex items-center text-gray-700 py-2 px-3 hover:text-white hover:rounded-xl hover:bg-blue-600"><Globe className="w-5 h-5 mr-1"/> Feeds</Link>
          <Link to="/notes" className="flex items-center text-gray-700 py-2 px-3 hover:text-white hover:rounded-xl hover:bg-blue-600"><StickyNote className="w-5 h-5 mr-1"/> My Notes</Link>
          <Link to="/profile" className="flex items-center text-gray-700 py-2 px-3 hover:text-white hover:rounded-xl hover:bg-blue-600"><User className="w-5 h-5 mr-1"/> Profile</Link>
        </div>

        <div className="flex items-center space-x-4">
          <form className="relative hidden sm:block">
            <input 
              type="text" 
              placeholder="Search for notes" 
              className="pl-3 pr-10 py-1 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="submit" className="absolute right-2 top-1.5 text-gray-400 hover:text-gray-600">
              <Search className="w-4 h-4" />
            </button>
          </form>
          <Settings className="w-5 h-5 text-gray-600 cursor-pointer hover:text-blue-600" />
        </div>
      </nav>
    </header>
  );
}