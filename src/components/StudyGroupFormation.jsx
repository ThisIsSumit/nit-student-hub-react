import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function StudyGroupFormation() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ course: '', semester: '', style: '' });
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
      const response = await axios.post('http://localhost:8080/api/study/match', formData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setMatches(response.data);
      gsap.fromTo(resultRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
    } catch (error) {
      console.error('Error fetching matches:', error);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto text-white">
      <h2 className="text-3xl font-semibold mb-6 text-yellow-300">Study Group Formation</h2>
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 bg-blue-800 p-6 rounded-lg shadow-lg">
        <input
          type="text"
          placeholder="Course"
          value={formData.course}
          onChange={(e) => setFormData({ ...formData, course: e.target.value })}
          className="form-input w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-blue-700 text-white placeholder-gray-400"
        />
        <input
          type="text"
          placeholder="Semester"
          value={formData.semester}
          onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
          className="form-input w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-blue-700 text-white placeholder-gray-400"
        />
        <input
          type="text"
          placeholder="Study Style"
          value={formData.style}
          onChange={(e) => setFormData({ ...formData, style: e.target.value })}
          className="form-input w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-blue-700 text-white placeholder-gray-400"
        />
        <button
          type="submit"
          className="w-full bg-yellow-600 text-white p-3 rounded-lg hover:bg-yellow-700 transition-all duration-300 transform hover:scale-105"
        >
          Find Group
        </button>
      </form>
      {matches.length > 0 && (
        <div ref={resultRef} className="mt-6 bg-blue-700 p-4 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold mb-4 text-yellow-300">Matching Groups</h3>
          <ul className="space-y-2">
            {matches.map((match, index) => (
              <li key={index} className="p-2 bg-blue-600 rounded hover:bg-blue-500 transition-all duration-300">
                <p><strong>{match.username}</strong> (Roll No: {match.rollNo})</p>
                <p>Course: {match.course} | Semester: {match.semester} | Style: {match.style}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default StudyGroupFormation;