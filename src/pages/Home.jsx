import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { GlobeLock } from 'lucide-react';

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
    <div className="h-full">
      <div className=" max-w-7xl mx-auto  px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center text-center">
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
        <div className='flex flex-col md:flex-row xl:w-[800px] justify-between items-center mt-16 gap-4'>
          <div className=' h-70 bg-white p-4 pt-4 rounded-lg shadow-lg'>
            <div className='relative mb-2'>
              <div className='absolute left-0 inline bg-blue-600 text-white p-1 rounded-lg shadow-md '>
                <GlobeLock size={22} className=''/>
              </div>
              <h2 className='text-lg mt-0 font-semibold inline'>Global and <br/> secure</h2>
            </div>
            <p>
              Store your thoughts, ideas, and tasks online. 
              Organize them with custom tags, keep them private, 
              or share them publicly with the community. 
              Tailor your feed to see exactly what matters to you.
            </p>
          </div>
          <div className=' h-70 bg-white p-4 pt-4 rounded-lg shadow-lg'>
            <div className='relative mb-2'>
              <div className='absolute left-0 inline bg-blue-600 text-white p-1 rounded-lg shadow-md'>
                <GlobeLock size={22} className=''/>
              </div>
              <h2 className='text-lg mt-0 font-semibold inline'>Control</h2>
            </div>
            <p>
              Only share notes you want to share. Keep your private notes private, 
              and share only what you choose with the world. 
              Your notes, your rules.
            </p>
          </div>
          <div className='h-70 bg-white p-4 pt-4 rounded-lg shadow-lg'>
            <div className='relative mb-2'>
              <div className='absolute left-0 inline bg-blue-600 text-white p-1 rounded-lg shadow-md'>
                <GlobeLock size={22} className=''/>
              </div>
              <h2 className='text-lg mt-0 font-semibold inline'>Get Ideas</h2>
            </div>
            <p>
              Read what others are sharing, and get inspired. 
              Follow your favorite note-takers to see their latest 
              thoughts and ideas in your feed. Discover new perspectives 
              and insights from the community.
            </p>
          </div>
        </div>
      </div>
      <footer className='text-center text-white text-sm px-2 pb-2 md:px-5 md:pb-5'>
          <div className='bg-blue-600 rounded-xl p-4'>
            <div className='mb-2 flex items-center justify-around'>
              <div className=''>
                <img src="images/logo.png" alt="Notes Logo" className='w-24 h-24'/>
              </div>
            </div>
            <div>
              <p className='inline-block'>Developer: Mmaduabuchi Igwilo - </p>&copy; {new Date().getFullYear()} Notes. All rights reserved.
            </div>
          </div>
      </footer>
    </div>
  );
}