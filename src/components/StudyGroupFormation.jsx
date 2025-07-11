import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useAuth } from '../context/AuthContext';
import { Users, BookOpen, GraduationCap, Brain, Search, UserPlus, Mail, Phone } from 'lucide-react';

function StudyGroupFormation() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ course: '', semester: '', style: '' });
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const resultRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    if (formRef.current) {
      gsap.from(formRef.current.querySelectorAll('.form-input'), {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.5,
        ease: 'power2.out',
      });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Original axios call - keeping your backend logic intact
      const response = await fetch('http://localhost:8080/api/study/match', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}` 
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      setMatches(data);
      if (resultRef.current) {
        gsap.fromTo(resultRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
      }
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const studyStyleOptions = [
    { value: 'visual', label: 'Visual Learning', icon: '👁️' },
    { value: 'auditory', label: 'Auditory Learning', icon: '🎧' },
    { value: 'kinesthetic', label: 'Hands-on Learning', icon: '✋' },
    { value: 'reading', label: 'Reading/Writing', icon: '📚' },
    { value: 'group', label: 'Group Discussion', icon: '💬' },
    { value: 'solo', label: 'Independent Study', icon: '🤓' }
  ];

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Users className="h-12 w-12 text-yellow-400 mr-3" />
            <h1 className="text-4xl font-bold text-yellow-400">Study Group Formation</h1>
          </div>
          <p className="text-gray-400 text-lg">Connect with like-minded students and form effective study groups</p>
        </div>

        {/* Main Form */}
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 mb-8 border border-gray-700">
          <div ref={formRef} onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Course Input */}
                <div className="form-input">
                  <label className="flex items-center text-yellow-300 font-semibold mb-2">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Course
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Computer Science, Mathematics, Physics"
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                    className="w-full p-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>

                {/* Semester Input */}
                <div className="form-input">
                  <label className="flex items-center text-yellow-300 font-semibold mb-2">
                    <GraduationCap className="h-5 w-5 mr-2" />
                    Semester
                  </label>
                  <select
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                    className="w-full p-4 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                    required
                  >
                    <option value="">Select Semester</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                      <option key={sem} value={sem}>Semester {sem}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Study Style Selection */}
              <div className="form-input">
                <label className="flex items-center text-yellow-300 font-semibold mb-3">
                  <Brain className="h-5 w-5 mr-2" />
                  Study Style Preference
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {studyStyleOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, style: option.value })}
                      className={`p-3 rounded-lg border-2 transition-all duration-300 flex items-center justify-center text-sm font-medium ${
                        formData.style === option.value
                          ? 'border-yellow-500 bg-yellow-500/20 text-yellow-300'
                          : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      <span className="mr-2">{option.icon}</span>
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || !formData.course || !formData.semester || !formData.style}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Finding Matches...
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5 mr-2" />
                    Find Study Group
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {matches.length > 0 && (
          <div ref={resultRef} className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
            <div className="flex items-center mb-6">
              <UserPlus className="h-8 w-8 text-yellow-400 mr-3" />
              <h2 className="text-3xl font-bold text-yellow-400">Matching Study Partners</h2>
            </div>
            
            <div className="grid gap-4">
              {matches.map((match, index) => (
                <div 
                  key={index} 
                  className="bg-gray-700 rounded-xl p-6 border border-gray-600 hover:border-yellow-500 transition-all duration-300 transform hover:scale-105"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="h-12 w-12 bg-yellow-500 rounded-full flex items-center justify-center text-gray-900 font-bold text-lg mr-4">
                        {match.username[0].toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{match.username}</h3>
                        <p className="text-gray-400">Roll No: {match.rollNo}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors duration-300">
                        <Mail className="h-4 w-4 text-white" />
                      </button>
                      <button className="p-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors duration-300">
                        <Phone className="h-4 w-4 text-white" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 text-yellow-400 mr-2" />
                      <span className="text-gray-300">Course: </span>
                      <span className="text-white font-medium ml-1">{match.course}</span>
                    </div>
                    <div className="flex items-center">
                      <GraduationCap className="h-4 w-4 text-yellow-400 mr-2" />
                      <span className="text-gray-300">Semester: </span>
                      <span className="text-white font-medium ml-1">{match.semester}</span>
                    </div>
                    <div className="flex items-center">
                      <Brain className="h-4 w-4 text-yellow-400 mr-2" />
                      <span className="text-gray-300">Style: </span>
                      <span className="text-white font-medium ml-1 capitalize">{match.style}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-600">
                    <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Send Study Group Invite
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Matches Message */}
        {matches.length === 0 && formData.course && formData.semester && formData.style && !loading && (
          <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700 text-center">
            <Users className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-300 mb-2">No Matches Found</h3>
            <p className="text-gray-400">Try adjusting your preferences or check back later for new study partners.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudyGroupFormation;