import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { FiHome, FiUsers, FiBook, FiCode, FiMessageSquare, FiLogIn, FiLogOut, FiUserPlus } from 'react-icons/fi';
import Home from './components/Home';
import RoommateFinder from './components/RoommateFinder';
import StudyGroupFormation from './components/StudyGroupFormation';
import HackathonTeamBuilder from './components/HackathonTeamBuilder';
import Chat from './components/Chat';
import Login from './components/Login';
import Register from './components/Register';
import { AuthProvider, useAuth } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
          <Navbar />
          <div className="pt-24 pb-10 px-4 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/roommate" element={<PrivateRoute><RoommateFinder /></PrivateRoute>} />
              <Route path="/study" element={<PrivateRoute><StudyGroupFormation /></PrivateRoute>} />
              <Route path="/hackathon" element={<PrivateRoute><HackathonTeamBuilder /></PrivateRoute>} />
              <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

function Navbar() {
  const navRef = useRef(null);
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    gsap.to(navRef.current, { 
      y: 0, 
      opacity: 1, 
      duration: 0.8, 
      ease: 'power3.out' 
    });
  }, []);

  const navLinks = [
    { path: "/", name: "Home", icon: <FiHome className="mr-1" /> },
    { path: "/roommate", name: "Roommate", icon: <FiUsers className="mr-1" /> },
    { path: "/study", name: "Study", icon: <FiBook className="mr-1" /> },
    { path: "/hackathon", name: "Hackathon", icon: <FiCode className="mr-1" /> },
    { path: "/chat", name: "Chat", icon: <FiMessageSquare className="mr-1" /> },
  ];

  return (
    <nav
      ref={navRef}
      style={{ transform: 'translateY(-100px)', opacity: 0 }}
      className="bg-gray-800 bg-opacity-90 backdrop-filter backdrop-blur-sm p-4 fixed w-full z-50 shadow-xl"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center mr-3">
              <FiHome className="text-white text-xl" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent">
              NIT Hamirpur Hub
            </h1>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center px-3 py-2 rounded-md transition-all ${location.pathname === link.path ? 'bg-blue-700 text-yellow-300' : 'hover:bg-gray-700 hover:text-yellow-300'}`}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}

          {currentUser ? (
            <button
              onClick={logout}
              className="flex items-center px-3 py-2 rounded-md hover:bg-red-700 transition-all"
            >
              <FiLogOut className="mr-1" />
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className={`flex items-center px-3 py-2 rounded-md transition-all ${location.pathname === '/login' ? 'bg-blue-700 text-yellow-300' : 'hover:bg-gray-700 hover:text-yellow-300'}`}
              >
                <FiLogIn className="mr-1" />
                Login
              </Link>
              <Link
                to="/register"
                className={`flex items-center px-3 py-2 rounded-md transition-all ${location.pathname === '/register' ? 'bg-blue-700 text-yellow-300' : 'hover:bg-gray-700 hover:text-yellow-300'}`}
              >
                <FiUserPlus className="mr-1" />
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
          >
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 pb-4">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${location.pathname === link.path ? 'bg-blue-700 text-yellow-300' : 'hover:bg-gray-700 hover:text-yellow-300'}`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}

            {currentUser ? (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium hover:bg-red-700"
              >
                <FiLogOut className="mr-1" />
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/login' ? 'bg-blue-700 text-yellow-300' : 'hover:bg-gray-700 hover:text-yellow-300'}`}
                >
                  <FiLogIn className="mr-1" />
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/register' ? 'bg-blue-700 text-yellow-300' : 'hover:bg-gray-700 hover:text-yellow-300'}`}
                >
                  <FiUserPlus className="mr-1" />
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-800 bg-opacity-90 backdrop-filter backdrop-blur-sm py-6 mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center mr-3">
              <FiHome className="text-white text-sm" />
            </div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent">
              NIT Hamirpur Hub
            </h2>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-yellow-300 transition-colors">
              Terms
            </a>
            <a href="#" className="text-gray-400 hover:text-yellow-300 transition-colors">
              Privacy
            </a>
            <a href="#" className="text-gray-400 hover:text-yellow-300 transition-colors">
              Contact
            </a>
          </div>
        </div>
        <div className="mt-6 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} NIT Hamirpur Hub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default App;