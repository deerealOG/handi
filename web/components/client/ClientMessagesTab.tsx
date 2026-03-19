"use client";

import {
  CheckCircle,
  Clock,
  Image as ImageIcon,
  Loader2,
  MessageCircle,
  Paperclip,
  Send,
  User,
  X,
} from "lucide-react";
import { useState } from "react";

// Mock conversations — will be replaced with real API when messaging backend is ready
const MOCK_CONVERSATIONS = [
  {
    id: "c1",
    name: "CoolAir Solutions",
    avatar: "CA",
    lastMessage: "We'll arrive at 2:00 PM as scheduled.",
    time: "2 min ago",
    unread: 2,
    online: true,
    service: "AC Servicing",
  },
  {
    id: "c2",
    name: "SparkleClean NG",
    avatar: "SC",
    lastMessage: "Your deep cleaning appointment is confirmed for tomorrow.",
    time: "1 hour ago",
    unread: 0,
    online: true,
    service: "Home Cleaning",
  },
  {
    id: "c3",
    name: "PowerFix Pro",
    avatar: "PF",
    lastMessage: "We've completed the electrical wiring. Please inspect and confirm.",
    time: "Yesterday",
    unread: 1,
    online: false,
    service: "Electrical Wiring",
  },
  {
    id: "c4",
    name: "HANDI Support",
    avatar: "HS",
    lastMessage: "Your refund has been processed. Is there anything else we can help with?",
    time: "2 days ago",
    unread: 0,
    online: true,
    service: "Support",
  },
];

const MOCK_MESSAGES = [
  { id: "m1", sender: "provider", text: "Hello! I'm on my way to your location.", time: "1:30 PM", read: true },
  { id: "m2", sender: "client", text: "Great, I'll be home. The gate code is 4527.", time: "1:32 PM", read: true },
  { id: "m3", sender: "provider", text: "Got it, thanks! I should arrive in about 20 minutes.", time: "1:35 PM", read: true },
  { id: "m4", sender: "client", text: "Sounds good. Should I prepare anything?", time: "1:40 PM", read: true },
  { id: "m5", sender: "provider", text: "No, I have all the tools needed. Just make sure the area around the AC unit is clear.", time: "1:42 PM", read: true },
  { id: "m6", sender: "provider", text: "We'll arrive at 2:00 PM as scheduled.", time: "1:55 PM", read: false },
];

export default function ClientMessagesTab() {
  const [selectedConvo, setSelectedConvo] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [searchQuery, setSearchQuery] = useState("");

  const activeConvo = MOCK_CONVERSATIONS.find((c) => c.id === selectedConvo);

  const filteredConvos = MOCK_CONVERSATIONS.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.service.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sendMessage = () => {
    if (!messageInput.trim()) return;
    setMessages([
      ...messages,
      {
        id: `m${messages.length + 1}`,
        sender: "client",
        text: messageInput,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        read: false,
      },
    ]);
    setMessageInput("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden flex h-[calc(100vh-200px)] min-h-[500px]">
        {/* Sidebar: Conversation List */}
        <div className={`${selectedConvo ? "hidden md:flex" : "flex"} flex-col w-full md:w-80 lg:w-96 border-r border-gray-100`}>
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Messages</h2>
            <div className="relative">
              <MessageCircle size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 rounded-full text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredConvos.map((convo) => (
              <button
                key={convo.id}
                onClick={() => setSelectedConvo(convo.id)}
                className={`w-full flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors text-left ${
                  selectedConvo === convo.id ? "bg-emerald-50" : ""
                }`}
              >
                <div className="relative shrink-0">
                  <div className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                    {convo.avatar}
                  </div>
                  {convo.online && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-900 truncate">{convo.name}</p>
                    <span className="text-[10px] text-gray-400 shrink-0">{convo.time}</span>
                  </div>
                  <p className="text-[10px] text-primary font-medium">{convo.service}</p>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{convo.lastMessage}</p>
                </div>
                {convo.unread > 0 && (
                  <span className="w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center shrink-0 mt-1">
                    {convo.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        {selectedConvo && activeConvo ? (
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <button onClick={() => setSelectedConvo(null)} className="md:hidden p-1 hover:bg-gray-100 rounded-lg">
                  <X size={18} />
                </button>
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                  {activeConvo.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{activeConvo.name}</p>
                  <p className="text-[10px] text-green-500 font-medium flex items-center gap-1">
                    {activeConvo.online ? (
                      <><span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Online</>
                    ) : (
                      <><Clock size={10} /> Last seen recently</>
                    )}
                  </p>
                </div>
              </div>
              <div className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                {activeConvo.service}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "client" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                      msg.sender === "client"
                        ? "bg-primary text-white rounded-br-md"
                        : "bg-white text-gray-800 shadow-sm rounded-bl-md"
                    }`}
                  >
                    <p>{msg.text}</p>
                    <div className={`flex items-center gap-1 mt-1 ${msg.sender === "client" ? "justify-end" : ""}`}>
                      <span className={`text-[9px] ${msg.sender === "client" ? "text-white/60" : "text-gray-400"}`}>
                        {msg.time}
                      </span>
                      {msg.sender === "client" && msg.read && (
                        <CheckCircle size={10} className="text-white/60" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-100 bg-white">
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Attach file">
                  <Paperclip size={18} className="text-gray-400" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Send image">
                  <ImageIcon size={18} className="text-gray-400" />
                </button>
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  className="flex-1 px-4 py-2.5 bg-gray-50 rounded-full text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  onClick={sendMessage}
                  disabled={!messageInput.trim()}
                  className="p-2.5 bg-primary text-white rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 hidden md:flex items-center justify-center bg-gray-50/50">
            <div className="text-center">
              <MessageCircle size={48} className="mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500 text-sm">Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
