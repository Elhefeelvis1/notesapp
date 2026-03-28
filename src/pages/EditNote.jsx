import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../components/AuthProvider';

export default function EditNote() {
  const { session } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '', content: '', is_favourite: false, is_uncompleted: true, is_public: false
  });
  const [tagsInput, setTagsInput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) fetchNote();
  }, [id]);

  const fetchNote = async () => {
    const { data } = await supabase.from('notes').select('*').eq('id', id).single();
    if (data) {
      setFormData(data);
      setTagsInput(data.tags.join(', '));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tagsArray = tagsInput.split(',').map(tag => tag.trim().toLowerCase()).filter(tag => tag);
    
    if (tagsArray.length < 2) {
      setError('Please provide at least two comma-separated tags.');
      return;
    }

    const payload = { ...formData, tags: tagsArray, user_id: session.user.id };
    
    const { error: dbError } = id 
      ? await supabase.from('notes').update(payload).eq('id', id)
      : await supabase.from('notes').insert([payload]);

    if (!dbError) navigate('/notes');
    else setError(dbError.message);
  };

  return (
    <div className="max-w-3xl mx-auto pb-15 md:pb-6 md:mt-6 p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-6">{id ? 'Edit Note' : 'Add New Note'}</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-wrap gap-6 py-4">
          {/* Favourite Toggle */}
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer"
              checked={formData.is_favourite} 
              onChange={e => setFormData({...formData, is_favourite: e.target.checked})} 
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            <span className="ml-3 text-sm font-medium text-gray-700">Favourite</span>
          </label>

          {/* Uncompleted Toggle */}
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer"
              checked={formData.is_uncompleted} 
              onChange={e => setFormData({...formData, is_uncompleted: e.target.checked})} 
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            <span className="ml-3 text-sm font-medium text-gray-700">Uncompleted</span>
          </label>

          {/* Make Public Toggle */}
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer"
              checked={formData.is_public} 
              onChange={e => setFormData({...formData, is_public: e.target.checked})} 
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            <span className="ml-3 text-sm font-medium text-gray-700">Make Public</span>
          </label>
        </div>
        <div>
          <label className="block text-gray-700 font-medium">Title</label>
          <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full mt-1 p-2 border rounded" />
        </div>
        
        <div>
          <label className="block text-gray-700 font-medium">Content</label>
          <textarea rows="10" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full mt-1 p-2 border rounded"></textarea>
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Tags (comma separated, at least 2)</label>
          <input type="text" placeholder="e.g., programming, javascript" value={tagsInput} onChange={e => setTagsInput(e.target.value)} className="w-full mt-1 p-2 border rounded" />
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          {id ? 'Update Note' : 'Create Note'}
        </button>
      </form>
    </div>
  );
}