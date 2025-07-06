import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function HackathonTeamBuilder() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    techStack: '',
    rollNo: '',
    hostel: '',
    languages: '',
    habits: '',
    otherDetails: '',
  });
  const [matches, setMatches] = useState([]);
  const resultRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    gsap.from(formRef.current.querySelectorAll('.form-input'), {
      opacity: 0,
      y: 20,
      stagger: 0.1,
      duration: 0.5,
      ease: 'power2.out',
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/hackathon/match', formData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setMatches(response.data);
      gsap.fromTo(resultRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
    } catch (error) {
      console.error('Error fetching matches:', error);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto text-white">
      <h2 className="text-4xl font-bold mb-6 text-yellow-300">Hackathon Team Builder</h2>
      <p className="mb-6 text-gray-200">Find teammates based on tech skills, preferences, and habits.</p>
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 bg-blue-800 p-6 rounded-lg shadow-lg">
        <input
          type="text"
          placeholder="Tech Stack (e.g., React, Python)"
          value={formData.techStack}
          onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
          className="form-input w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-blue-700 text-white placeholder-gray-400"
        />
        <input
          type="text"
          placeholder="Roll Number (e.g., 2019CS123)"
          value={formData.rollNo}
          onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
          className="form-input w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-blue-700 text-white placeholder-gray-400"
        />
        <input
          type="text"
          placeholder="Hostel (e.g., Vindhyanchal)"
          value={formData.hostel}
          onChange={(e) => setFormData({ ...formData, hostel: e.target.value })}
          className="form-input w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-blue-700 text-white placeholder-gray-400"
        />
        <input
          type="text"
          placeholder="Languages Known (e.g., Hindi, English)"
          value={formData.languages}
          onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
          className="form-input w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-blue-700 text-white placeholder-gray-400"
        />
        <input
          type="text"
          placeholder="Habits (e.g., Non-smoker, Non-drinker)"
          value={formData.habits}
          onChange={(e) => setFormData({ ...formData, habits: e.target.value })}
          className="form-input w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-blue-700 text-white placeholder-gray-400"
        />
        <input
          type="text"
          placeholder="Other Details (e.g., Avid coder)"
          value={formData.otherDetails}
          onChange={(e) => setFormData({ ...formData, otherDetails: e.target.value })}
          className="form-input w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-blue-700 text-white placeholder-gray-400"
        />
        <button
          type="submit"
          className="w-full bg-yellow-600 text-white p-3 rounded-lg hover:bg-yellow-700 transition-all duration-300 transform hover:scale-105"
        >
          Find Teammates
        </button>
      </form>
      {matches.length > 0 && (
        <div ref={resultRef} className="mt-6 bg-blue-700 p-4 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold mb-4 text-yellow-300">Matching Teammates</h3>
          <ul className="space-y-2">
            {matches.map((match, index) => (
              <li
                key={index}
                className="p-2 bg-blue-600 rounded hover:bg-blue-500 transition-all duration-300 cursor-pointer"
                onMouseEnter={() => gsap.to(this, { scale: 1.02 })}
                onMouseLeave={() => gsap.to(this, { scale: 1 })}
              >
                <p><strong>{match.username}</strong> (Roll No: {match.rollNo})</p>
                <p>Tech Stack: {match.techStack}</p>
                <p>Hostel: {match.hostel} | Languages: {match.languages}</p>
                <p>Habits: {match.habits} | Details: {match.otherDetails}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default HackathonTeamBuilder;