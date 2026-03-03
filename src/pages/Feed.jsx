import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Feed() {
  const [publicNotes, setPublicNotes] = useState([]);
  const [userTags, setUserTags] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return navigate('/login');
    
    const { data: profile } = await supabase.from('profiles').select('tags').eq('id', user.id).single();
    const preferredTags = profile?.tags || [];
    setUserTags(preferredTags);

    // 2. Fetch all public notes. 
    let query = supabase.from('notes')
      .select('*, profiles(full_name)')
      .eq('is_public', true)
      .neq('user_id', user.id) // Don't show their own notes in the feed
      .order('created_at', { ascending: false });

    // 3. If they have preferred tags, filter the feed using Postgres array overlapping operator
    if (preferredTags.length > 0) {
      query = query.overlaps('tags', preferredTags);
    }

    const { data: notes } = await query;
    setPublicNotes(notes || []);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Explore Feed</h1>
      <p className="text-gray-600 mb-6">
        Tailored to your interests: {userTags.length > 0 ? userTags.join(', ') : 'All public notes'}
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {publicNotes.map(note => (
          <div key={note.id} className="bg-white p-5 rounded-lg shadow border border-gray-100">
            <h3 className="text-xl font-semibold">{note.title}</h3>
            <p className="text-sm text-gray-500 mt-1">By: {note.profiles?.full_name || 'Anonymous'}</p>
            <p className="mt-3 text-gray-700 line-clamp-3">{note.content}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {note.tags.map(tag => (
                <span key={tag} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}