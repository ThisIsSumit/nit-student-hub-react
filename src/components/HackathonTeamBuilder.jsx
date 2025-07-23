import { useState, useEffect, useRef } from 'react';
import {
  Code,
  Users,
  Zap,
  Trophy,
  MapPin,
  Languages,
  Coffee,
  Star,
  Search,
  Terminal,
  Cpu,
  Github,
  Lightbulb,
  Target,
  Award,
  Rocket,
  Person,
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function HackathonTeamBuilder() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    techStack: '',
    rollNo: '',
    name: '',
    languages: '',
    habits: '',
    otherDetails: '',
  });
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
        }, index * 100);
      });
    }
  }, []);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:8080/api/hackathon/match', formData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
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
    } finally {
      setIsLoading(false);
    }
  };

  const getSkillColor = (skill) => {
    const colors = {
      'Frontend': 'bg-blue-500',
      'Backend': 'bg-green-500',
      'Database': 'bg-purple-500',
      'Machine Learning': 'bg-orange-500',
      'Data Science': 'bg-pink-500',
      'Design': 'bg-cyan-500',
      'Mobile': 'bg-indigo-500',
      'AI/ML': 'bg-red-500'
    };
    return colors[skill] || 'bg-gray-500';
  };

  const getExperienceColor = (experience) => {
    const colors = {
      'Beginner': 'from-green-400 to-green-500',
      'Intermediate': 'from-yellow-400 to-orange-500',
      'Advanced': 'from-red-400 to-red-500'
    };
    return colors[experience] || 'from-gray-400 to-gray-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-10 flex flex-col items-center justify-start relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-1/3 right-10 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-10 left-1/3 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>

      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="max-w-4xl w-full relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-md rounded-full px-6 py-3 mb-4 border border-cyan-500/30">
            <Terminal className="w-6 h-6 text-cyan-400" />
            <Code className="w-6 h-6 text-blue-400" />
            <Zap className="w-6 h-6 text-purple-400" />
          </div>
          <h2 className="text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Hackathon Team Builder
          </h2>
          <p className="text-white/80 text-xl max-w-2xl mx-auto leading-relaxed">
            Connect with skilled developers, designers, and innovators to build the perfect hackathon team
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span className="text-white/80 text-sm">Find Winners</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
              <Lightbulb className="w-4 h-4 text-orange-400" />
              <span className="text-white/80 text-sm">Build Ideas</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
              <Rocket className="w-4 h-4 text-green-400" />
              <span className="text-white/80 text-sm">Launch Fast</span>
            </div>
          </div>
        </div>

        {/* 👇 FORM AREA (unchanged UI, wired with real backend) */}
        <div ref={formRef} className="space-y-6 bg-white/5 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/10 relative">
          <div className="flex justify-between mb-8">
            {[0, 1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className={`flex-1 h-2 rounded-full mx-1 transition-all duration-500 ${
                  step < Object.values(formData).filter(v => v).length
                    ? 'bg-gradient-to-r from-cyan-400 to-blue-400'
                    : 'bg-white/10'
                }`}
              />
            ))}
          </div>

           <div
          ref={formRef}
          className="space-y-6 bg-white/5 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/10 relative"
        >
          {/* Form progress */}
          <div className="flex justify-between mb-8">
            {[0, 1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className={`flex-1 h-2 rounded-full mx-1 transition-all duration-500 ${
                  step < Object.values(formData).filter(v => v).length
                    ? 'bg-gradient-to-r from-cyan-400 to-blue-400' 
                    : 'bg-white/10'
                }`}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {/* Name */}
            <div className="form-input space-y-2">
              <label className="flex items-center gap-2 text-white/90 font-medium">
                <MapPin className="w-4 h-4 text-purple-400" />
                Name
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-white placeholder-white/50 transition-all duration-300 hover:bg-white/15"
                />
              </div>
            </div>
            {/* Tech Stack */}
            <div className="form-input space-y-2">
              <label className="flex items-center gap-2 text-white/90 font-medium">
                <Code className="w-4 h-4 text-cyan-400" />
                Tech Stack
              </label>
              <div className="relative">
                <Cpu className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type="text"
                  placeholder="React, Node.js, Python, MongoDB"
                  value={formData.techStack}
                  onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-white placeholder-white/50 transition-all duration-300 hover:bg-white/15"
                />
              </div>
            </div>

            {/* Roll Number */}
            <div className="form-input space-y-2">
              <label className="flex items-center gap-2 text-white/90 font-medium">
                <Target className="w-4 h-4 text-blue-400" />
                Roll Number
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 font-medium">#</span>
                <input
                  type="text"
                  placeholder="29BEC122"
                  value={formData.rollNo}
                  onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder-white/50 transition-all duration-300 hover:bg-white/15"
                />
              </div>
            </div>

         

            {/* Languages */}
            <div className="form-input space-y-2">
              <label className="flex items-center gap-2 text-white/90 font-medium">
                <Languages className="w-4 h-4 text-green-400" />
                Languages Known
              </label>
              <div className="relative">
                <Languages className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type="text"
                  placeholder="Hindi, English, Python, JavaScript"
                  value={formData.languages}
                  onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-white placeholder-white/50 transition-all duration-300 hover:bg-white/15"
                />
              </div>
            </div>
          </div>

          {/* Habits */}
          <div className="form-input space-y-2">
            <label className="flex items-center gap-2 text-white/90 font-medium">
              <Coffee className="w-4 h-4 text-orange-400" />
              Habits & Preferences
            </label>
            <div className="relative">
              <Coffee className="absolute left-3 top-4 w-5 h-5 text-white/50" />
              <textarea
                placeholder="Non-smoker, Coffee addict, Night owl, Team player"
                value={formData.habits}
                onChange={(e) => setFormData({ ...formData, habits: e.target.value })}
                rows={3}
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-white placeholder-white/50 transition-all duration-300 hover:bg-white/15 resize-none"
              />
            </div>
          </div>

          {/* Other Details */}
          <div className="form-input space-y-2">
            <label className="flex items-center gap-2 text-white/90 font-medium">
              <Star className="w-4 h-4 text-yellow-400" />
              Experience & Achievements
            </label>
            <div className="relative">
              <Github className="absolute left-3 top-4 w-5 h-5 text-white/50" />
              <textarea
                placeholder="Full-stack developer, 3 hackathons won, Published research, Open source contributor"
                value={formData.otherDetails}
                onChange={(e) => setFormData({ ...formData, otherDetails: e.target.value })}
                rows={3}
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-white placeholder-white/50 transition-all duration-300 hover:bg-white/15 resize-none"
              />
            </div>
          </div>
        </div>
          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Finding Team Members...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Find My Dream Team
              </>
            )}
          </button>
        </div>

        {/* Results Display (same UI) */}
        {matches.length > 0 && (
          <div ref={resultRef} className="mt-8 space-y-6">
            <div className="text-center">
              <h3 className="text-4xl font-bold text-white mb-2">
                🚀 Found {matches.length} Perfect Teammates!
              </h3>
              <p className="text-white/70 text-lg">Ready to build something amazing together</p>
            </div>

            <div className="grid gap-6">
              {matches.map((match, index) => (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:scale-102 hover:shadow-2xl"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                          {match.username.charAt(0).toUpperCase()}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-r ${getExperienceColor(match.experience)} flex items-center justify-center`}>
                          <Award className="w-3 h-3 text-white" />
                        </div>
                      </div>
                      <div>
                        <h4 className="text-2xl font-bold text-white">{match.username}</h4>
                        <p className="text-white/70">Roll No: {match.rollNo}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs bg-white/10 px-2 py-1 rounded-full text-white/80">
                            {match.experience}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-full px-4 py-2 border border-green-400/30">
                      <Trophy className="w-4 h-4 text-green-400" />
                      <span className="text-white font-medium">{match.matchScore}% Match</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {match.skills.map((skill, skillIndex) => (
                      <span key={skillIndex} className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getSkillColor(skill)}`}>
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Code className="w-4 h-4 text-cyan-400" />
                        <span className="text-white/90"><span className="font-medium">Tech:</span> {match.techStack}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-purple-400" />
                        <span className="text-white/90"><span className="font-medium">Hostel:</span> {match.hostel}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Languages className="w-4 h-4 text-green-400" />
                        <span className="text-white/90"><span className="font-medium">Languages:</span> {match.languages}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Coffee className="w-4 h-4 text-orange-400" />
                        <span className="text-white/90"><span className="font-medium">Habits:</span> {match.habits}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 mb-6">
                    <Star className="w-4 h-4 text-yellow-400 mt-0.5" />
                    <span className="text-white/90"><span className="font-medium">Experience:</span> {match.otherDetails}</span>
                  </div>

                  <div className="flex gap-3">
                    <button className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2">
                      <Users className="w-4 h-4" />
                      Team Up
                    </button>
                    <button className="flex-1 bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 border border-white/20 flex items-center justify-center gap-2">
                      <Github className="w-4 h-4" />
                      View Portfolio
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .bg-grid-pattern {
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>
    </div>
  );
}

export default HackathonTeamBuilder;
