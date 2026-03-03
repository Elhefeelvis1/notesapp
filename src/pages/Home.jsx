import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Home() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center text-center">
      <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-6">
        Take your notes anywhere, securely.
      </h1>
      <p className="text-xl text-gray-500 max-w-2xl mb-10">
        Store your thoughts, ideas, and tasks online. Organize them with custom tags, keep them private, or share them publicly with the community. Tailor your feed to see exactly what matters to you.
      </p>

      {session ? (
        <div className="space-x-4">
          <Link to="/notes" className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition">
            Go to My Notes
          </Link>
          <button 
            onClick={() => supabase.auth.signOut()} 
            className="px-8 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="space-x-4">
          <Link to="/login" className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition">
            Login
          </Link>
          <Link to="/signup" className="px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition">
            Sign Up
          </Link>
        </div>
      )}

      <footer className="mt-24 text-gray-400 text-sm">
        <p>Copyright: Mmaduabuchi Igwilo @2026</p>
      </footer>
    </div>
  );
}