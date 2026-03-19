"use client";
import {
  MessageCircle,
  Search,
  Send,
  Image as ImageIcon,
  MapPin,
} from "lucide-react";
import { useState } from "react";
import { MOCK_CONVERSATIONS } from "./data";

export default function MessagesTab() {
  const [selectedConvo, setSelectedConvo] = useState(MOCK_CONVERSATIONS[0]);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = MOCK_CONVERSATIONS.filter((c) =>
    c.customer.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSend = () => {
    if (!messageInput.trim()) return;
    setMessageInput("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Messages</h2>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex" style={{ height: "calc(100vh - 220px)" }}>
        {/* Conversation List */}
        <div className="w-80 border-r border-gray-100 flex flex-col shrink-0">
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-gray-50 rounded-xl text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((convo) => (
              <button
                key={convo.id}
                onClick={() => setSelectedConvo(convo)}
                className={`w-full flex items-start gap-3 p-3.5 text-left transition-colors cursor-pointer border-b border-gray-50 ${
                  selectedConvo?.id === convo.id
                    ? "bg-emerald-50"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {convo.customer.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-900 truncate">{convo.customer}</p>
                    <span className="text-[10px] text-gray-400 shrink-0 ml-2">{convo.time}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{convo.lastMessage}</p>
                </div>
                {convo.unread > 0 && (
                  <span className="min-w-[20px] h-5 flex items-center justify-center bg-primary text-white text-[10px] font-bold rounded-full px-1.5 shrink-0">
                    {convo.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        {selectedConvo ? (
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
                {selectedConvo.customer.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{selectedConvo.customer}</p>
                <p className="text-[10px] text-primary font-medium">Online</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {selectedConvo.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "provider" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] px-4 py-2.5 rounded-2xl ${
                      msg.sender === "provider"
                        ? "bg-primary text-white rounded-br-md"
                        : "bg-gray-100 text-gray-900 rounded-bl-md"
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-[10px] mt-1 ${msg.sender === "provider" ? "text-white/60" : "text-gray-400"}`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-gray-100 flex items-center gap-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
                <ImageIcon size={18} />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
                <MapPin size={18} />
              </button>
              <input
                type="text"
                placeholder="Type a message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 px-4 py-2 bg-gray-50 rounded-full text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={handleSend}
                className="p-2.5 bg-primary text-white rounded-full hover:bg-primary transition-colors cursor-pointer"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <MessageCircle size={48} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
