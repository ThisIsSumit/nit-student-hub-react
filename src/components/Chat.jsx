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
  const [onlineUsers] = useState(['Alice', 'Bob', 'Charlie']); // Mock online users for UI
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
          ease: "power2.out"
        });
      }
      // Auto-scroll to bottom
      if (chatRef.current) {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }
    });

    return () => newSocket.disconnect();
  }, [user?.token]);

  useEffect(() => {
    // Focus input on load
    inputRef.current?.focus();
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (socket && message && user) {
      socket.emit('sendMessage', { token: user.token, content: message });
      setMessage('');
      inputRef.current?.focus();
      
      // Simulate typing indicator for demo
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 2000);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-gray-900 min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <MessageCircle className="h-8 w-8 text-yellow-400" />
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-yellow-400">Chat Room</h2>
              <p className="text-sm text-gray-400">Connected as {user?.username || 'Guest'}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-400">{onlineUsers.length} online</span>
            </div>
            <div className="flex -space-x-2">
              {onlineUsers.slice(0, 3).map((username, index) => (
                <div 
                  key={username}
                  className="h-8 w-8 rounded-full bg-yellow-500 flex items-center justify-center text-xs font-bold text-gray-900 border-2 border-gray-700"
                >
                  {username[0]}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div 
        ref={chatRef} 
        className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-800"
        style={{ maxHeight: 'calc(100vh - 200px)' }}
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="bg-gray-700 p-8 rounded-xl border border-gray-600">
              <MessageCircle className="h-16 w-16 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-300 text-lg mb-2">No messages yet</p>
              <p className="text-gray-500 text-sm">Start the conversation and say hello!</p>
            </div>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div 
              key={index} 
              className={`flex ${msg.sender === user?.username ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-xs sm:max-w-md px-4 py-3 rounded-lg shadow-lg ${
                  msg.sender === user?.username 
                    ? 'bg-yellow-600 text-white' 
                    : 'bg-gray-700 text-white border border-gray-600'
                }`}
              >
                {msg.sender && msg.sender !== user?.username && (
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white">
                      {msg.sender[0]}
                    </div>
                    <p className="text-xs font-semibold text-yellow-300">{msg.sender}</p>
                  </div>
                )}
                <p className="break-words">{msg.content}</p>
                <div className="flex items-center justify-end mt-2 space-x-1">
                  <Clock className="h-3 w-3 opacity-60" />
                  <p className="text-xs opacity-70">
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-700 px-4 py-3 rounded-lg border border-gray-600">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="h-2 w-2 bg-yellow-400 rounded-full animate-bounce"></div>
                  <div className="h-2 w-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="h-2 w-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <p className="text-xs text-gray-400">Someone is typing...</p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Input Area */}
      <div className="bg-gray-800 border-t border-gray-700 p-4">
        <form onSubmit={sendMessage} className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="Type your message..."
              autoComplete="off"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              <span className="text-xs">{message.length}/1000</span>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={!message}
            className="bg-yellow-600 hover:bg-yellow-700 text-white p-3 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-yellow-600 flex items-center justify-center"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
        
        <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
          <p>Press Enter to send</p>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <span>Connected</span>
            </div>
            <span>•</span>
            <span>{messages.length} messages</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;