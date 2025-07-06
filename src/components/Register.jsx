import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import axios from 'axios';
import { FiUser, FiLock, FiHome, FiCode, FiCoffee, FiLayers, FiInfo, FiBook } from 'react-icons/fi';

function Register() {
  const [formData, setFormData] = useState({
    rollNo: '',
    username: '',
    password: '',
    hostel: '',
    languages: '',
    habits: '',
    techStack: '',
    otherDetails: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const formRef = useRef(null);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.rollNo) newErrors.rollNo = 'Roll Number is required';
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.password || formData.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters';
    if (!formData.hostel) newErrors.hostel = 'Hostel is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await axios.post('http://localhost:8080/api/auth/register', formData);
      gsap.to('.success-message', {
        opacity: 1,
        y: 0,
        duration: 0.5,
        onComplete: () => {
          setTimeout(() => navigate('/login'), 1500);
        }
      });
    } catch (error) {
      console.error('Registration failed:', error);
      setErrors({ submit: error.response?.data?.message || 'Registration failed' });
    } finally {
      setIsSubmitting(false);
    }
  };
 useEffect(() => {
    const container = formRef.current;
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">
            Create Account
          </h2>
          <p className="text-gray-400">Join the NIT Hamirpur community</p>
        </div>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="bg-gray-800 bg-opacity-80 backdrop-filter backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-gray-700"
        >
          {/* Required Fields Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-yellow-400 mb-4 flex items-center">
              <FiUser className="mr-2" /> Basic Information
            </h3>
            <div className="space-y-4">
              <div className="form-group">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Roll Number"
                    value={formData.rollNo}
                    onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                    className={inputClass(errors.rollNo)}
                  />
                  <span className="absolute left-3 top-3.5 text-gray-400">#</span>
                </div>
                {errors.rollNo && <p className="text-red-400 text-sm mt-1">{errors.rollNo}</p>}
              </div>

              <div className="form-group">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className={inputClass(errors.username)}
                  />
                  <FiUser className="absolute left-3 top-3.5 text-gray-400" />
                </div>
                {errors.username && <p className="text-red-400 text-sm mt-1">{errors.username}</p>}
              </div>

              <div className="form-group">
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={inputClass(errors.password)}
                  />
                  <FiLock className="absolute left-3 top-3.5 text-gray-400" />
                </div>
                {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
              </div>

              <div className="form-group">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Hostel"
                    value={formData.hostel}
                    onChange={(e) => setFormData({ ...formData, hostel: e.target.value })}
                    className={inputClass(errors.hostel)}
                  />
                  <FiHome className="absolute left-3 top-3.5 text-gray-400" />
                </div>
                {errors.hostel && <p className="text-red-400 text-sm mt-1">{errors.hostel}</p>}
              </div>
            </div>
          </div>

          {/* Additional Details Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-yellow-400 mb-4 flex items-center">
              <FiInfo className="mr-2" /> Additional Details
            </h3>
            <div className="space-y-4">
              <div className="form-group">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Languages you know"
                    value={formData.languages}
                    onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                    className={inputClass()}
                  />
                  <FiBook className="absolute left-3 top-3.5 text-gray-400" />
                </div>
              </div>

              <div className="form-group">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Your habits"
                    value={formData.habits}
                    onChange={(e) => setFormData({ ...formData, habits: e.target.value })}
                    className={inputClass()}
                  />
                  <FiCoffee className="absolute left-3 top-3.5 text-gray-400" />
                </div>
              </div>

              <div className="form-group">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tech stack"
                    value={formData.techStack}
                    onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                    className={inputClass()}
                  />
                  <FiCode className="absolute left-3 top-3.5 text-gray-400" />
                </div>
              </div>

              <div className="form-group">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Other details"
                    value={formData.otherDetails}
                    onChange={(e) => setFormData({ ...formData, otherDetails: e.target.value })}
                    className={inputClass()}
                  />
                  <FiLayers className="absolute left-3 top-3.5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
              isSubmitting
                ? 'bg-yellow-700 cursor-not-allowed'
                : 'bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 shadow-lg hover:shadow-yellow-500/30'
            } text-white flex items-center justify-center`}
          >
            {isSubmitting ? (
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
                Processing...
              </>
            ) : (
              'Create Account'
            )}
          </button>

          {errors.submit && <div className="mt-4 text-red-400 text-center">{errors.submit}</div>}

          <div className="success-message opacity-0 -translate-y-5 mt-4 text-center">
            <div className="inline-flex items-center bg-green-900/30 text-green-400 px-4 py-2 rounded-lg">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Registration successful! Redirecting...
            </div>
          </div>

          <div className="mt-6 text-center text-gray-400">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-yellow-400 hover:text-yellow-300 underline transition-colors"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
