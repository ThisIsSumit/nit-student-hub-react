import { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import io from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { Send, Users, MessageCircle, Clock } from 'lucide-react';

function Chat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers] = useState(['Alice', 'Bob', 'Charlie']); // Mock online users
  const chatRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const newSocket = io('http://localhost:8080');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      newSocket.emit('join', user?.token);
    });

    newSocket.on('message', (msg) => {
      setMessages((prev) => [...prev, msg]);
      if (chatRef.current && chatRef.current.lastChild) {
        gsap.from(chatRef.current.lastChild, {
          opacity: 0,
          y: 20,
          duration: 0.5,
          ease: 'power2.out',
        });
      }
      chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
    });

    return () => newSocket.disconnect();
  }, [user?.token]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (socket && message && user) {
      socket.emit('sendMessage', { token: user.token, content: message });
      setMessage('');
      inputRef.current?.focus();
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 2000);
    }
  };

  const formatTime = (timestamp) =>
    new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white p-4">
      {/* Header */}
      <div className="max-w-4xl w-full mx-auto bg-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-xl p-6 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MessageCircle className="text-yellow-400 h-7 w-7" />
            <div>
              <h2 className="text-2xl font-bold text-yellow-400">Chat Room</h2>
              <p className="text-sm text-gray-400">Welcome, {user?.username || 'Guest'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-400">{onlineUsers.length} online</span>
            </div>
            <div className="flex -space-x-2">
              {onlineUsers.slice(0, 3).map((name) => (
                <div
                  key={name}
                  className="h-8 w-8 rounded-full bg-yellow-500 flex items-center justify-center text-sm font-bold text-gray-900 border-2 border-gray-800"
                >
                  {name[0]}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={chatRef}
        className="flex-1 max-w-4xl w-full mx-auto bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 overflow-y-auto space-y-4 shadow-inner"
        style={{ maxHeight: '60vh' }}
      >
        {messages.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-600" />
            <p className="text-lg">No messages yet</p>
            <p className="text-sm text-gray-500">Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === user?.username ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs sm:max-w-md px-4 py-3 rounded-xl shadow-lg text-sm ${
                  msg.sender === user?.username
                    ? 'bg-yellow-500 text-gray-900'
                    : 'bg-gray-700 text-white border border-gray-600'
                }`}
              >
                {msg.sender !== user?.username && (
                  <div className="flex items-center mb-2 space-x-2">
                    <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white">
                      {msg.sender[0]}
                    </div>
                    <p className="text-xs text-yellow-300 font-semibold">{msg.sender}</p>
                  </div>
                )}
                <p>{msg.content}</p>
                <div className="flex items-center justify-end mt-2 space-x-1 text-xs text-gray-400">
                  <Clock className="w-3 h-3" />
                  <span>{formatTime(msg.timestamp)}</span>
                </div>
              </div>
            </div>
          ))
        )}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-700 px-4 py-3 rounded-xl border border-gray-600 flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="h-2 w-2 bg-yellow-400 rounded-full animate-bounce" />
                <div
                  className="h-2 w-2 bg-yellow-400 rounded-full animate-bounce"
                  style={{ animationDelay: '0.1s' }}
                />
                <div
                  className="h-2 w-2 bg-yellow-400 rounded-full animate-bounce"
                  style={{ animationDelay: '0.2s' }}
                />
              </div>
              <p className="text-xs text-gray-400">Someone is typing...</p>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="max-w-4xl w-full mx-auto bg-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-2xl p-4 mt-4 shadow-xl">
        <form onSubmit={sendMessage} className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 pl-4 pr-20 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="Type your message..."
              maxLength={1000}
              autoComplete="off"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
              {message.length}/1000
            </div>
          </div>

          <button
            type="submit"
            disabled={!message}
            className="bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 text-gray-900 p-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>

        <div className="flex justify-between text-xs text-gray-400 mt-2 px-1">
          <span>Press Enter to send</span>
          <span>{messages.length} messages • {onlineUsers.length} online</span>
        </div>
      </div>
    </div>
  );
}

export default Chat;
