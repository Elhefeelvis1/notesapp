import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {useAuth} from '../components/AuthProvider';
import { supabase } from '../supabaseClient';
import BouncingLoader from '../components/BouncingLoader';
import { useSearchParams } from 'react-router-dom';

export default function Feed() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');
  const {loading, session} = useAuth();
  const [publicNotes, setPublicNotes] = useState([]);
  const [userTags, setUserTags] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {

    const { data: profile } = await supabase.from('profiles').select('tags').eq('user_id', session.user.id).single();
    const preferredTags = profile?.tags || [];
    setUserTags(preferredTags);

    // 2. Fetch all public notes. 
    let query = supabase.from('notes')
      .select('*, profiles(alias)')
      .eq('is_public', true)
      .neq('user_id', session.user.id) // Don't show their own notes in the feed
      .order('created_at', { ascending: false });

    if(searchQuery){
      const tagsArray = searchQuery.split(',').map(tag => tag.trim().toLowerCase()).filter(tag => tag.length > 0);
      if(tagsArray.length > 0){
        query = query.overlaps('tags', tagsArray);
      }
    // 3. If they have preferred tags, filter the feed using Postgres array overlapping operator
    }else if (preferredTags.length > 0) {
      query = query.overlaps('tags', preferredTags);
    }

    const { data: notes } = await query;
    setPublicNotes(notes || []);

    setPageLoading(false);
  };

  return (
    <>
    {loading && <BouncingLoader />}
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Explore Feed</h1>
      <p className="text-gray-600 mb-6">
        Tailored to your interests: {userTags.length > 0 ? userTags.join(', ') : 'All public notes'}
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {publicNotes.map(note => (
          <div key={note.id} className="bg-white p-5 rounded-lg shadow border border-gray-100">
            <h3 className="text-xl font-semibold">{note.title}</h3>
            <p className="text-sm text-gray-500 mt-1">By: {note.profiles?.alias || 'Anonymous'}</p>
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
    </>
  );
}