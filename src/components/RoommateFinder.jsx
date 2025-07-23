import { useState, useEffect, useRef } from 'react';
import { Search, Users, Home, DollarSign, Heart, MapPin, Star, Check } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Update path if needed

function RoommateFinder() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ hostel: '', budget: '', habits: '' });
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const resultRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    const inputs = formRef.current?.querySelectorAll('.form-input');
    if (inputs) {
      inputs.forEach((input, index) => {
        input.style.opacity = '0';
        input.style.transform = 'translateY(20px)';
        setTimeout(() => {
          input.style.transition = 'all 0.5s ease';
          input.style.opacity = '1';
          input.style.transform = 'translateY(0)';
        }, index * 150);
      });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:8080/api/roommate/match',
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setMatches(response.data);

      setTimeout(() => {
        if (resultRef.current) {
          resultRef.current.style.opacity = '0';
          resultRef.current.style.transform = 'translateY(30px)';
          resultRef.current.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
          setTimeout(() => {
            resultRef.current.style.opacity = '1';
            resultRef.current.style.transform = 'translateY(0)';
          }, 100);
        }
      }, 200);
    } catch (error) {
      console.error('Error fetching matches:', error);
      alert('Failed to fetch matches. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getMatchColor = (score) => {
    if (score >= 90) return 'from-green-400 to-emerald-500';
    if (score >= 80) return 'from-blue-400 to-blue-500';
    if (score >= 70) return 'from-yellow-400 to-amber-500';
    return 'from-red-400 to-red-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 flex flex-col items-center justify-start relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-40 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>

      <div className="max-w-2xl w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-full px-6 py-3 mb-4 border border-white/20">
            <Users className="w-6 h-6 text-blue-400" />
            <span className="text-white font-medium">Roommate Matching</span>
          </div>
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Find Your Perfect Match
          </h2>
          <p className="text-white/70 text-lg max-w-md mx-auto">
            Connect with compatible roommates based on your preferences and lifestyle
          </p>
        </div>

        {/* FORM START */}
        <form
          onSubmit={handleSubmit}
          ref={formRef}
          className="space-y-6 bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/20 relative"
        >
          {/* Progress indicator */}
          <div className="flex justify-between mb-6">
            {[0, 1, 2].map((step) => (
              <div
                key={step}
                className={`w-1/3 h-2 rounded-full mx-1 transition-all duration-300 ${
                  step <= Math.floor((Object.values(formData).filter(v => v).length / 3) * 2) 
                    ? 'bg-gradient-to-r from-blue-400 to-purple-400' 
                    : 'bg-white/20'
                }`}
              />
            ))}
          </div>

          {/* Hostel */}
          <div className="form-input space-y-2">
            <label className="flex items-center gap-2 text-white/90 font-medium">
              <Home className="w-4 h-4" />
              Hostel Preference
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
              <input
                type="text"
                placeholder="e.g., Vindhyanchal, Kailash, Nilgiri"
                value={formData.hostel}
                onChange={(e) => setFormData({ ...formData, hostel: e.target.value })}
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder-white/50 transition-all duration-300 hover:bg-white/15"
              />
            </div>
          </div>

          {/* Budget */}
          <div className="form-input space-y-2">
            <label className="flex items-center gap-2 text-white/90 font-medium">
              <DollarSign className="w-4 h-4" />
              Budget Range
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 font-medium">₹</span>
              <input
                type="text"
                placeholder="e.g., 5000, 4000-6000"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder-white/50 transition-all duration-300 hover:bg-white/15"
              />
            </div>
          </div>

          {/* Habits */}
          <div className="form-input space-y-2">
            <label className="flex items-center gap-2 text-white/90 font-medium">
              <Heart className="w-4 h-4" />
              Lifestyle & Habits
            </label>
            <div className="relative">
              <Star className="absolute left-3 top-4 w-5 h-5 text-white/50" />
              <textarea
                placeholder="e.g., Non-smoker, Early riser, Fitness enthusiast, Study-focused"
                value={formData.habits}
                onChange={(e) => setFormData({ ...formData, habits: e.target.value })}
                rows={3}
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder-white/50 transition-all duration-300 hover:bg-white/15 resize-none"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Finding Matches...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Find My Roommates
              </>
            )}
          </button>
        </form>
        {/* FORM END */}

        {/* Results */}
        {matches.length > 0 && (
          <div ref={resultRef} className="mt-8 space-y-6">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-white mb-2">
                🎉 Found {matches.length} Perfect Matches!
              </h3>
              <p className="text-white/70">Here are your most compatible roommates</p>
            </div>

            <div className="grid gap-6">
              {matches.map((match, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-102 hover:shadow-2xl"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${getMatchColor(match.matchScore)} flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                        {match.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-white">{match.username}</h4>
                        <p className="text-white/70 text-sm">Roll No: {match.rollNo}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1">
                      <Check className="w-4 h-4 text-green-400" />
                      <span className="text-white font-medium">{match.matchScore}% Match</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Home className="w-4 h-4 text-blue-400" />
                      <span className="text-white/90">
                        <span className="font-medium">Hostel:</span> {match.hostel}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-4 h-4 text-green-400" />
                      <span className="text-white/90">
                        <span className="font-medium">Budget:</span> ₹{match.budget}
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Heart className="w-4 h-4 text-pink-400 mt-0.5" />
                      <span className="text-white/90">
                        <span className="font-medium">Habits:</span> {match.habits}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105">
                      Connect
                    </button>
                    <button className="flex-1 bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 border border-white/20">
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RoommateFinder;
