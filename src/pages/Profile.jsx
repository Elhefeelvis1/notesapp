import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Profile() {
  const [profile, setProfile] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [tagsInput, setTagsInput] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return navigate('/login');

    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    if (data) {
      setProfile(data);
      setTagsInput(data.tags ? data.tags.join(', ') : '');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const tagsArray = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag);
    const { data: { user } } = await supabase.auth.getUser();
    
    await supabase.from('profiles').update({
      full_name: profile.full_name,
      country: profile.country,
      hobbies: profile.hobbies,
      tags: tagsArray
    }).eq('id', user.id);
    
    setIsEditing(false);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 border-b pb-2">Profile Details</h2>
      
      {!isEditing ? (
        <div className="space-y-4">
          <p><strong>Full Name:</strong> {profile.full_name || 'Not set'}</p>
          <p><strong>Country:</strong> {profile.country || 'Not set'}</p>
          <p><strong>Hobbies:</strong> {profile.hobbies || 'Not set'}</p>
          <p><strong>Followed Tags:</strong> {profile.tags?.length > 0 ? profile.tags.join(', ') : 'None'}</p>
          <button onClick={() => setIsEditing(true)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">Edit Profile</button>
        </div>
      ) : (
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-gray-700">Full Name</label>
            <input type="text" value={profile.full_name || ''} onChange={e => setProfile({...profile, full_name: e.target.value})} className="w-full mt-1 p-2 border rounded" />
          </div>
          <div>
            <label className="block text-gray-700">Country</label>
            <input type="text" value={profile.country || ''} onChange={e => setProfile({...profile, country: e.target.value})} className="w-full mt-1 p-2 border rounded" />
          </div>
          <div>
            <label className="block text-gray-700">Followed Tags (Comma separated)</label>
            <input type="text" placeholder="e.g., javascript, design" value={tagsInput} onChange={e => setTagsInput(e.target.value)} className="w-full mt-1 p-2 border rounded" />
          </div>
          <div className="flex space-x-4">
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Save</button>
            <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-400 text-white rounded">Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
}