import { useState, useEffect, useRef } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TOURFLO_LOGOS } from '../lib/branding';
import { haptics } from '../lib/haptics';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'tourguide';
  timestamp: Date;
}

const QUICK_CHIPS = [
  "What's popular?",
  "Best beaches?",
  "Theme parks",
  "Family activities",
];

interface ChatScreenProps {
  session: any;
}

export default function ChatScreen({ session }: ChatScreenProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showChips, setShowChips] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const greeting: Message = {
      id: '1',
      text: "Hello! 👋 I'm TourGuide AI, your personal Florida tour assistant. I can help you find the best experiences, answer questions, or book activities. What are you interested in?",
      sender: 'tourguide',
      timestamp: new Date(),
    };
    setMessages([greeting]);
    setTimeout(() => setShowChips(true), 500);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const getTourGuideResponse = (userMessage: string): string => {
    const msg = userMessage.toLowerCase();

    if (msg.includes('beach')) {
      return "Florida has incredible beaches! Clearwater Beach has crystal-clear turquoise water and powdery white sand. For something quieter, try Siesta Key - consistently rated one of America's best beaches. The Keys also offer amazing snorkeling and diving!";
    }

    if (msg.includes('theme') || msg.includes('park')) {
      return "Florida is the theme park capital of the world! Orlando has Disney World, Universal Studios, and SeaWorld. Tampa has Busch Gardens. Each offers unique experiences. What kind of thrills are you looking for?";
    }

    if (msg.includes('popular') || msg.includes('best')) {
      return "Right now, Everglades airboat tours are super popular - you can see alligators up close! Miami boat tours, Keys snorkeling, and Tampa sunset cruises are also trending. What type of adventure appeals to you?";
    }

    if (msg.includes('book') || msg.includes('reserve')) {
      return "Awesome! Our Florida tour operators offer everything from Miami food tours to Keys diving adventures. Which experience interests you? And how many guests?";
    }

    if (msg.includes('family') || msg.includes('kids')) {
      return "Perfect! How old are the kids? Theme parks work for all ages. Everglades tours are best for 6+. Beach activities and manatee tours are great for young ones too!";
    }

    return "That's a great question! I can help you explore Florida's best experiences - from Miami's vibrant culture to the Keys' tropical paradise, Tampa's adventure scene to Orlando's world-class attractions. What interests you most?";
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    haptics.light();

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);
    setShowChips(false);

    setTimeout(() => {
      const responseText = getTourGuideResponse(text);
      const tourguideMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'tourguide',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, tourguideMessage]);
      setIsTyping(false);
      haptics.light();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 flex flex-col">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/1590549/pexels-photo-1590549.jpeg?auto=compress&cs=tinysrgb&w=1920)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-florida-ocean/50 via-florida-ocean/40 to-black/70" />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex-shrink-0 px-6 pt-6 pb-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={TOURFLO_LOGOS.chatAvatarWhite}
                alt="TourGuide AI"
                className="w-16 h-16 object-contain drop-shadow-2xl"
              />
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-lg">
                <div className="absolute inset-0 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
              </div>
            </div>
            <div>
              <h1
                className="text-2xl font-bold text-white drop-shadow-lg"
                style={{ fontFamily: 'Poppins', fontWeight: 700 }}
              >
                TourGuide AI
              </h1>
              <p className="text-sm text-white/90 drop-shadow-md flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Your AI Florida Guide
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <div className="space-y-4 py-4">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`${message.sender === 'user' ? 'max-w-[80%] ml-auto' : 'max-w-[85%] mr-auto'}`}>
                  {message.sender === 'tourguide' && (
                    <div className="flex items-center gap-2 mb-2">
                      <img
                        src={TOURFLO_LOGOS.chatAvatarWhite}
                        alt="TourGuide AI"
                        className="w-6 h-6 object-contain drop-shadow-lg"
                      />
                      <span className="text-xs text-white/90 font-medium drop-shadow-md">
                        TourGuide AI
                      </span>
                    </div>
                  )}
                  <div
                    className={`rounded-3xl px-5 py-4 shadow-2xl ${
                      message.sender === 'user'
                        ? 'bg-white/95 backdrop-blur-xl text-gray-900'
                        : 'bg-gradient-to-br from-florida-ocean to-florida-sunset text-white border border-white/20'
                    }`}
                    style={{ fontFamily: 'Poppins' }}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  </div>
                  <p className={`text-xs mt-2 px-2 drop-shadow-md ${
                    message.sender === 'user' ? 'text-white/70 text-right' : 'text-white/70'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            ))}

            <AnimatePresence>
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-start"
                >
                  <div className="max-w-[85%] mr-auto">
                    <div className="flex items-center gap-2 mb-2">
                      <img
                        src={TOURFLO_LOGOS.chatAvatarWhite}
                        alt="TourGuide AI"
                        className="w-6 h-6 object-contain drop-shadow-lg"
                      />
                      <span className="text-xs text-white/90 font-medium drop-shadow-md">
                        TourGuide AI
                      </span>
                    </div>
                    <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl px-5 py-4 shadow-2xl">
                      <div className="flex gap-1.5">
                        <motion.span
                          className="w-2.5 h-2.5 bg-white rounded-full"
                          animate={{ y: [0, -8, 0] }}
                          transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                        />
                        <motion.span
                          className="w-2.5 h-2.5 bg-white rounded-full"
                          animate={{ y: [0, -8, 0] }}
                          transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                        />
                        <motion.span
                          className="w-2.5 h-2.5 bg-white rounded-full"
                          animate={{ y: [0, -8, 0] }}
                          transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {showChips && messages.length === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-2 pt-2"
              >
                {QUICK_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => handleSendMessage(chip)}
                    className="flex-shrink-0 rounded-full bg-white/15 backdrop-blur-xl border border-white/30 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/25 transition-all shadow-lg"
                    style={{ fontFamily: 'Poppins' }}
                  >
                    {chip}
                  </button>
                ))}
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="flex-shrink-0 px-6 pb-6 pt-2">
          <div className="bg-white/15 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl p-3">
            <div className="flex items-center gap-3">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
                placeholder="Ask TourGuide AI anything..."
                className="flex-1 bg-transparent text-white placeholder-white/70 focus:outline-none text-sm"
                style={{ fontFamily: 'Poppins' }}
              />
              <button
                onClick={() => handleSendMessage(inputText)}
                disabled={!inputText.trim()}
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-all shadow-lg ${
                  inputText.trim()
                    ? 'bg-white hover:scale-105'
                    : 'bg-white/30 opacity-50 cursor-not-allowed'
                }`}
              >
                <Send className={`w-5 h-5 ${inputText.trim() ? 'text-[#0077BE]' : 'text-white'}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
