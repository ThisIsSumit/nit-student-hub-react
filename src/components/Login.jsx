import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import axios from 'axios';

function Login() {
  const [formData, setFormData] = useState({ rollNo: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const formRef = useRef(null);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Basic validation
    if (!formData.rollNo || !formData.password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      // Make API call to login endpoint
      const response = await axios.post('/api/auth/login', {
        rollNo: formData.rollNo,
        password: formData.password,
      });

      // If login is successful
      if (response.data.success) {
        // Store auth token in localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        setSuccess(true);
        
        // Redirect to home after a short delay
        setTimeout(() => {
          navigate('/home');
        }, 1500);
      }
    } catch (err) {
      // Handle different types of errors
      if (err.response?.status === 401) {
        setError('Invalid roll number or password');
      } else if (err.response?.status === 404) {
        setError('User not found. Please register first.');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token is still valid
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      navigate('/home');
    }
  }, [navigate]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.style.opacity = '0';
      container.style.transform = 'translateY(50px)';
      setTimeout(() => {
        container.style.transition = 'all 0.8s ease-out';
        container.style.opacity = '1';
        container.style.transform = 'translateY(0)';
      }, 100);
    }

    const inputs = formRef.current?.querySelectorAll('.form-group');
    if (inputs) {
      inputs.forEach((input, index) => {
        input.style.opacity = '0';
        input.style.transform = 'translateY(30px)';
        setTimeout(() => {
          input.style.transition = 'all 0.6s ease-out';
          input.style.opacity = '1';
          input.style.transform = 'translateY(0)';
        }, 200 + index * 100);
      });
    }
  }, []);

  const inputClass = (hasError) =>
    `w-full p-3 pl-10 rounded-lg bg-gray-800 text-white placeholder-gray-400 border ${
      hasError ? 'border-red-500 focus:ring-red-400' : 'border-gray-600 focus:ring-yellow-400'
    } focus:outline-none focus:ring-2 focus:border-yellow-400`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-4">
      <div ref={containerRef} className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">
            Welcome Back
          </h2>
          <p className="text-gray-400">Sign in to continue</p>
        </div>

        {/* Form */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="bg-gray-800 bg-opacity-80 backdrop-filter backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-gray-700"
        >
          <div className="space-y-6">
            {/* Roll Number */}
            <div className="form-group relative">
              <input
                type="text"
                placeholder="Roll Number"
                value={formData.rollNo}
                onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                className={inputClass(error)}
                disabled={isLoading}
              />
              <span className="absolute left-3 top-3.5 text-gray-400">#</span>
            </div>

            {/* Password with show/hide functionality */}
            <div className="form-group relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={`${inputClass(error)} pr-12`}
                disabled={isLoading}
              />
              <svg
                className="absolute left-3 top-3.5 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-300 focus:outline-none transition-colors duration-200"
                disabled={isLoading}
              >
                {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm">
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-3 text-green-200 text-sm">
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Login successful! Redirecting to home...
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                isLoading
                  ? 'bg-yellow-700 cursor-not-allowed'
                  : 'bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 shadow-lg hover:shadow-yellow-500/30'
              } text-white flex items-center justify-center`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </div>
        </form>

        {/* Register Link */}
        <div className="mt-6 text-center text-gray-400">
          Don't have an account?{' '}
          <button
            onClick={() => navigate('/register')}
            className="text-yellow-400 hover:text-yellow-300 underline transition-colors"
            disabled={isLoading}
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
