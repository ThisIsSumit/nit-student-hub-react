import { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import io from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

function Chat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const chatRef = useRef(null);

  useEffect(() => {
    const newSocket = io('http://localhost:8080');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      newSocket.emit('join', user?.token);
    });

    newSocket.on('message', (msg) => {
      setMessages((prev) => [...prev, msg]);
      gsap.from(chatRef.current.lastChild, { opacity: 0, y: 20, duration: 0.5 });
    });

    return () => newSocket.disconnect();
  }, [user?.token]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (socket && message && user) {
      socket.emit('sendMessage', { token: user.token, content: message });
      setMessage('');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto text-white">
      <h2 className="text-3xl font-semibold mb-6 text-yellow-300">Chat Room</h2>
      <div ref={chatRef} className="h-64 overflow-y-auto border p-4 mb-4 bg-white rounded text-black">
        {messages.map((msg, index) => (
          <p key={index} className="mb-2">{msg.content}</p>
        ))}
      </div>
      <form onSubmit={sendMessage} className="flex space-x-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-blue-700 text-white placeholder-gray-400"
          placeholder="Type a message..."
        />
        <button
          type="submit"
          className="bg-yellow-600 text-white p-3 rounded-lg hover:bg-yellow-700 transition-all duration-300 transform hover:scale-105"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default Chat;