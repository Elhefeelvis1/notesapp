import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Eye, EyeOff } from 'lucide-react';
import Popup from '../components/Popup';

export default function Auth() {
  const location = useLocation();
  const navigate = useNavigate();
  const isSignUp = location.pathname === '/signup';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [alias, setAlias] = useState('');
  
  // States for password visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle Popup
  const [popup, setPopup] = useState({
      state: false,
      content: '',
      feedback: ''
  });

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        // Validate matching passwords
        if (password !== confirmPassword) {
          throw new Error("Passwords don't match");
        }

        const { data: existingAlias, error: fetchError } = await supabase
          .from('profiles')
          .select('alias')
          .eq('alias', alias);

        if (fetchError) throw fetchError;
        
        if (existingAlias && existingAlias.length > 0) throw new Error("Alias already exists");

        // Register user
        const { data: signUp, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              alias: alias
            }
          },
        });
        
        if (signUpError) throw signUpError;

        setPassword('');
        setConfirmPassword('');

        setPopup({ state: true, feedback: 'success', content: 'Registration successful! Please log in.'});
        setTimeout(() => {
          navigate('/login');
          setPopup({ state: false, feedback: '', content: '' });
        }, 1000);
        
      } else {
        // Login user
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (signInError) throw signInError;

        navigate('/notes');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
  };

  return (
    <div className="w-full relative min-h-screen relative flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {popup.state && (
        <Popup
          feedback={popup.feedback}
          content={popup.content}
          onClose={() => setPopup({ state: false, content: "", feedback: "" })}
        />
      )}
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md border border-gray-100 z-10">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isSignUp ? 'Create your account' : 'Sign in to your account'}
          </h2>
        </div>
        
        {error && <div className="bg-red-50 text-red-500 p-3 rounded text-sm text-center">{error}</div>}

        <form className="mt-8 space-y-6" onSubmit={handleAuth}>
          <div className=" space-y-4">
            {isSignUp && (
              <div>
                <input
                  type="text"
                  required
                  placeholder="Enter your alias"
                  value={alias}
                  onChange={(e) => setAlias(e.target.value)}
                  className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            )}
            <div>
              <input
                type="email"
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            
            {/* Password Input with Toggle */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder={isSignUp ? "Create new password" : "Password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {/* Confirm Password Input with Toggle (Signup Only) */}
            {isSignUp && (
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  placeholder="Repeat password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
            >
              {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Sign In'}
            </button>
          </div>
        </form>

        {/* <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleGoogleLogin}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Google
            </button>
          </div>
        </div> */}

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            {isSignUp ? 'Already registered?' : "Don't have an account?"}{' '}
            <button 
              type="button"
              onClick={() => navigate(isSignUp ? '/login' : '/signup')} 
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              {isSignUp ? 'Login here' : 'Open a new one'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}