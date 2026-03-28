import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../components/AuthProvider';
import { User, MapPin, Activity, Tag, Edit2, Save, X, Camera } from 'lucide-react';

export default function Profile() {
  const { session } = useAuth();
  const [profile, setProfile] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [tagsInput, setTagsInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data } = await supabase.from('profiles').select('*').eq('user_id', session.user.id).single();
    if (data) {
      setProfile(data);
      setTagsInput(data.tags ? data.tags.join(', ') : '');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const tagsArray = tagsInput.split(',').map(tag => tag.trim().toLowerCase()).filter(tag => tag);
    
    await supabase.from('profiles').update({
      full_name: profile.full_name,
      country: profile.country,
      hobbies: profile.hobbies, // Now hooked up to an input!
      tags: tagsArray
    }).eq('user_id', session.user.id);
    
    setProfile(prev => ({ ...prev, tags: tagsArray }));
    setIsEditing(false);
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto mt-12 mb-20">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Header / Cover Area */}
        <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600 relative">
          <div className="absolute -bottom-12 left-8">
            <div className="w-24 h-24 bg-white rounded-full p-1 shadow-md flex items-center justify-center relative">
              <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                <User className="w-10 h-10" />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-16 px-8 pb-8">
          <div className="flex justify-between items-start mb-8 border-b border-gray-100 pb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{profile.full_name || 'Anonymous User'}</h1>
              <p className="text-gray-500 text-sm mt-1">{session?.user?.email}</p>
            </div>
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)} 
                className="flex items-center space-x-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-medium rounded-lg transition-colors border border-gray-200"
              >
                <Edit2 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>

          {!isEditing ? (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Country</p>
                    <p className="text-gray-900 font-medium">{profile.country || 'Not specified'}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Activity className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Hobbies</p>
                    <p className="text-gray-900 font-medium">{profile.hobbies || 'Not specified'}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Tag className="w-4 h-4 text-gray-400" />
                  <p className="text-sm font-medium text-gray-500">Followed Tags</p>
                </div>
                {profile.tags && profile.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.tags.map((tag, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-50 text-blue-600 text-sm font-medium rounded-full border border-blue-100">
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm italic">No tags followed yet.</p>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={handleUpdate} className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    value={profile.full_name || ''} 
                    onChange={e => setProfile({...profile, full_name: e.target.value})} 
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Jane Doe"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input 
                    type="text" 
                    value={profile.country || ''} 
                    onChange={e => setProfile({...profile, country: e.target.value})} 
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="e.g. Canada"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hobbies</label>
                <input 
                  type="text" 
                  value={profile.hobbies || ''} 
                  onChange={e => setProfile({...profile, hobbies: e.target.value})} 
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="e.g. Reading, Hiking, Coding"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Followed Tags (Comma separated)</label>
                <input 
                  type="text" 
                  placeholder="e.g. react, productivity, fitness" 
                  value={tagsInput} 
                  onChange={e => setTagsInput(e.target.value)} 
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                />
                <p className="text-xs text-gray-500 mt-1.5">Tags help us tailor your feed to your interests.</p>
              </div>
              
              <div className="flex items-center space-x-3 pt-4 border-t border-gray-100">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors disabled:bg-blue-400"
                >
                  <Save className="w-4 h-4" />
                  <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsEditing(false)} 
                  className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-6 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium rounded-xl transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}