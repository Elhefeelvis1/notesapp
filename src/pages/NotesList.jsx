import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Edit2, Trash2, Star, Plus } from 'lucide-react';

export default function NotesList() {
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyNotes();
  }, []);

  const fetchMyNotes = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return navigate('/login');

    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (!error) setNotes(data || []);
  };

  const deleteNote = async (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      await supabase.from('notes').delete().eq('id', id);
      setNotes(notes.filter(note => note.id !== id));
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 relative min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Notes</h1>
        <Link to="/edit" className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          <Plus className="w-5 h-5 mr-1" /> Add New
        </Link>
      </div>

      {notes.length === 0 ? (
        <p className="text-gray-500 text-center py-10">You haven't created any notes yet.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {notes.map(note => (
            <div key={note.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex flex-col hover:shadow-md transition">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-gray-800">{note.title}</h3>
                {note.is_favourite && <Star className="w-5 h-5 text-yellow-500 fill-current" />}
              </div>
              
              <p className="text-gray-600 flex-grow mb-4 whitespace-pre-wrap line-clamp-4">
                {note.content}
              </p>

              <div className="mb-4 flex flex-wrap gap-2">
                {note.tags && note.tags.map(tag => (
                  <span key={tag} className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full font-medium">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <div className="text-xs text-gray-400">
                  {note.is_public ? 'Public' : 'Private'} • {note.is_uncompleted ? 'Draft' : 'Completed'}
                </div>
                <div className="flex space-x-3">
                  <Link to={`/edit/${note.id}`} className="text-gray-400 hover:text-blue-600 transition">
                    <Edit2 className="w-4 h-4" />
                  </Link>
                  <button onClick={() => deleteNote(note.id)} className="text-gray-400 hover:text-red-600 transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}