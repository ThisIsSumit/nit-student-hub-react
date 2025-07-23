import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import axios from 'axios';
import { FiUser, FiLock, FiHome, FiCode, FiCoffee, FiLayers, FiInfo, FiBook, FiX, FiEye, FiEyeOff } from 'react-icons/fi';

function Register() {
  const [formData, setFormData] = useState({
    rollNo: '',
    username: '',
    password: '',
    hostel: '',
    languages: [],
    habits: '',
    techStack: [],
    otherDetails: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
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
    setErrors({});

    try {
      // Make API call to register endpoint
      const response = await axios.post('/api/auth/register', formData);

      // If registration is successful
      if (response.data.success) {
        // Store auth token and user data in localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Set axios default header for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
        setSuccess(true);
        
        // Show success animation
        gsap.to('.success-message', {
          opacity: 1,
          y: 0,
          duration: 0.5,
          onComplete: () => {
            // Redirect to home after a short delay
            setTimeout(() => {
              navigate('/home');
            }, 1500);
          }
        });
      }
    } catch (error) {
      console.error('Registration failed:', error);
      
      // Handle different types of errors
      if (error.response?.status === 409) {
        setErrors({ submit: 'User with this roll number already exists' });
      } else if (error.response?.status === 400) {
        setErrors({ submit: error.response.data.message || 'Invalid data provided' });
      } else if (error.response?.data?.message) {
        setErrors({ submit: error.response.data.message });
      } else {
        setErrors({ submit: 'Registration failed. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // User is already logged in, redirect to home
      navigate('/home');
    }
  }, [navigate]);

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

  const languageOptions = [
    // English and Major Indian Languages
    'English', 'Hindi', 'Bengali', 'Telugu', 'Marathi', 'Tamil', 'Urdu',
    'Gujarati', 'Kannada', 'Malayalam', 'Odia', 'Punjabi', 'Assamese',
    'Maithili', 'Santali', 'Kashmiri', 'Sindhi', 'Dogri', 'Konkani',
    'Manipuri (Meitei)', 'Bodo',
    
    // Nepal Languages
    'Nepali', 'Newari', 'Tharu', 'Tamang', 'Magar', 'Bhojpuri', 'Rai', 'Limbu',
    'Sherpa', 'Gurung',
    
    // Bangladesh Languages
    'Chittagonian', 'Sylheti', 'Rangpuri', 'Chakma', 'Marma',
    
    // Pakistan Languages
    'Pashto', 'Saraiki', 'Balochi', 'Brahui',
    
    // Sri Lanka Languages
    'Sinhala', 'Tamil (Sri Lankan)',
    
    // Myanmar (Burma) Languages
    'Burmese', 'Shan', 'Karen', 'Kachin', 'Mon',
    
    // China (Tibetan regions) Languages
    'Tibetan', 'Mandarin Chinese',
    
    // Bhutan Languages
    'Dzongkha', 'Lhotshamkha',
    
    // Afghanistan Languages
    'Dari', 'Hazaragi'
  ];

  const techStackOptions = [
    'React.js', 'Vue.js', 'Angular', 'Next.js', 'Svelte', 'Tailwind CSS',
    'Node.js', 'Express.js', 'Spring Boot', 'Django', 'Flask', 'FastAPI',
    'Ruby on Rails', 'ASP.NET Core', 'Go (Golang)', 'MongoDB', 'MySQL',
    'PostgreSQL', 'Firebase', 'Prisma', 'REST API', 'GraphQL', 'Apollo',
    'Redux', 'Zustand', 'Recoil', 'Docker', 'Kubernetes', 'Flutter',
    'React Native', 'Kotlin', 'Swift', 'Jetpack Compose', 'SwiftUI',
    'Supabase', 'Vite', 'T3 Stack', 'MERN Stack', 'MEAN Stack', 'MEVN Stack'
  ];

  const handleLanguageSelect = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue && !formData.languages.includes(selectedValue)) {
      setFormData({
        ...formData,
        languages: [...formData.languages, selectedValue]
      });
    }
    e.target.value = ''; // Reset dropdown
  };

  const removeLanguage = (languageToRemove) => {
    setFormData({
      ...formData,
      languages: formData.languages.filter(lang => lang !== languageToRemove)
    });
  };

  const handleTechStackSelect = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue && !formData.techStack.includes(selectedValue)) {
      setFormData({
        ...formData,
        techStack: [...formData.techStack, selectedValue]
      });
    }
    e.target.value = ''; // Reset dropdown
  };

  const removeTechStack = (techToRemove) => {
    setFormData({
      ...formData,
      techStack: formData.techStack.filter(tech => tech !== techToRemove)
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
                  />
                  <FiUser className="absolute left-3 top-3.5 text-gray-400" />
                </div>
                {errors.username && <p className="text-red-400 text-sm mt-1">{errors.username}</p>}
              </div>

              <div className="form-group">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={`${inputClass(errors.password)} pr-12`}
                    disabled={isSubmitting}
                  />
                  <FiLock className="absolute left-3 top-3.5 text-gray-400" />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-300 focus:outline-none transition-colors duration-200"
                    disabled={isSubmitting}
                  >
                    {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
              </div>

              <div className="form-group">
                <div className="relative">
                  <select
                    value={formData.hostel}
                    onChange={(e) => setFormData({ ...formData, hostel: e.target.value })}
                    className={`${inputClass(errors.hostel)} appearance-none cursor-pointer`}
                    disabled={isSubmitting}
                  >
                    <option value="" disabled className="bg-gray-800 text-gray-400">
                      Select your hostel
                    </option>
                    <option value="Kailash Boys Hostel" className="bg-gray-800 text-white">
                      Kailash Boys Hostel
                    </option>
                    <option value="Himadri Boys Hostel" className="bg-gray-800 text-white">
                      Himadri Boys Hostel
                    </option>
                    <option value="Himgiri Boys Hostel" className="bg-gray-800 text-white">
                      Himgiri Boys Hostel
                    </option>
                    <option value="Udaygiri Boys Hostel" className="bg-gray-800 text-white">
                      Udaygiri Boys Hostel
                    </option>
                    <option value="Neelkanth Boys Hostel" className="bg-gray-800 text-white">
                      Neelkanth Boys Hostel
                    </option>
                    <option value="Dhauladhar Boys Hostel" className="bg-gray-800 text-white">
                      Dhauladhar Boys Hostel
                    </option>
                    <option value="Vindhyachal Boys Hostel" className="bg-gray-800 text-white">
                      Vindhyachal Boys Hostel
                    </option>
                    <option value="Shivalik Boys Hostel" className="bg-gray-800 text-white">
                      Shivalik Boys Hostel
                    </option>
                    <option value="Ambika Girls Hostel" className="bg-gray-800 text-white">
                      Ambika Girls Hostel
                    </option>
                    <option value="Parvati Girls Hostel" className="bg-gray-800 text-white">
                      Parvati Girls Hostel
                    </option>
                    <option value="Mani-Mahesh Girls Hostel" className="bg-gray-800 text-white">
                      Mani-Mahesh Girls Hostel
                    </option>
                    <option value="Aravali Girls Hostel" className="bg-gray-800 text-white">
                      Aravali Girls Hostel
                    </option>
                  </select>
                  <FiHome className="absolute left-3 top-3.5 text-gray-400 pointer-events-none" />
                  <svg
                    className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
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
                  <select
                    onChange={handleLanguageSelect}
                    className={`${inputClass()} appearance-none cursor-pointer`}
                    disabled={isSubmitting}
                  >
                    <option value="" className="bg-gray-800 text-gray-400">
                      Select languages you know
                    </option>
                    {languageOptions.map((language) => (
                      <option 
                        key={language} 
                        value={language} 
                        disabled={formData.languages.includes(language)}
                        className={`bg-gray-800 ${formData.languages.includes(language) ? 'text-gray-500' : 'text-white'}`}
                      >
                        {language} {formData.languages.includes(language) ? '✓' : ''}
                      </option>
                    ))}
                  </select>
                  <FiBook className="absolute left-3 top-3.5 text-gray-400 pointer-events-none" />
                  <svg
                    className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                
                {/* Selected Languages Display */}
                {formData.languages.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {formData.languages.map((language) => (
                      <span
                        key={language}
                        className="inline-flex items-center gap-1 bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm font-medium border border-blue-500/30"
                      >
                        {language}
                        <button
                          type="button"
                          onClick={() => removeLanguage(language)}
                          className="ml-1 text-blue-300 hover:text-blue-100 focus:outline-none"
                          disabled={isSubmitting}
                        >
                          <FiX className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                
                {formData.languages.length > 0 && (
                  <p className="text-gray-400 text-xs mt-2">
                    Selected {formData.languages.length} language{formData.languages.length !== 1 ? 's' : ''}
                  </p>
                )}
              </div>

              <div className="form-group">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Your habits"
                    value={formData.habits}
                    onChange={(e) => setFormData({ ...formData, habits: e.target.value })}
                    className={inputClass()}
                    disabled={isSubmitting}
                  />
                  <FiCoffee className="absolute left-3 top-3.5 text-gray-400" />
                </div>
              </div>

              <div className="form-group">
                <div className="relative">
                  <select
                    onChange={handleTechStackSelect}
                    className={`${inputClass()} appearance-none cursor-pointer`}
                    disabled={isSubmitting}
                  >
                    <option value="" className="bg-gray-800 text-gray-400">
                      Select your tech stack
                    </option>
                    {techStackOptions.map((tech) => (
                      <option 
                        key={tech} 
                        value={tech} 
                        disabled={formData.techStack.includes(tech)}
                        className={`bg-gray-800 ${formData.techStack.includes(tech) ? 'text-gray-500' : 'text-white'}`}
                      >
                        {tech} {formData.techStack.includes(tech) ? '✓' : ''}
                      </option>
                    ))}
                  </select>
                  <FiCode className="absolute left-3 top-3.5 text-gray-400 pointer-events-none" />
                  <svg
                    className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                
                {/* Selected Tech Stacks Display */}
                {formData.techStack.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {formData.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center gap-1 bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full text-sm font-medium border border-yellow-500/30"
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() => removeTechStack(tech)}
                          className="ml-1 text-yellow-300 hover:text-yellow-100 focus:outline-none"
                          disabled={isSubmitting}
                        >
                          <FiX className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                
                {formData.techStack.length > 0 && (
                  <p className="text-gray-400 text-xs mt-2">
                    Selected {formData.techStack.length} tech stack{formData.techStack.length !== 1 ? 's' : ''}
                  </p>
                )}
              </div>

              <div className="form-group">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Other details"
                    value={formData.otherDetails}
                    onChange={(e) => setFormData({ ...formData, otherDetails: e.target.value })}
                    className={inputClass()}
                    disabled={isSubmitting}
                  />
                  <FiLayers className="absolute left-3 top-3.5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {errors.submit && (
            <div className="mb-4 bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm">
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
                {errors.submit}
              </div>
            </div>
          )}

          {/* Success Display */}
          {success && (
            <div className="mb-4 bg-green-500/20 border border-green-500/50 rounded-lg p-3 text-green-200 text-sm">
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
                Registration successful! Redirecting to home...
              </div>
            </div>
          )}

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

          <div className="success-message opacity-0 -translate-y-5 mt-4 text-center">
            <div className="inline-flex items-center bg-green-900/30 text-green-400 px-4 py-2 rounded-lg">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Registration successful! Redirecting to home...
            </div>
          </div>

          <div className="mt-6 text-center text-gray-400">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-yellow-400 hover:text-yellow-300 underline transition-colors"
              disabled={isSubmitting}
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
