"use client";

import { Bot, MessageSquare, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Message = {
  id: string;
  text: string;
  sender: "bot" | "user";
  timestamp: Date;
};

const QUICK_REPLIES = [
  "How do I book a service?",
  "I need help with my booking",
  "How do providers get verified?",
  "What are the payment options?",
  "I want to become a provider",
  "How do I cancel a booking?",
];

const BOT_RESPONSES: Record<string, string> = {
  "how do i book a service?":
    "Booking is easy! 🎯\n\n1. Go to the **Find Services** tab\n2. Browse or search for the service you need\n3. Select a provider and check their reviews\n4. Click **Book Now** and choose your preferred date & time\n5. Confirm your booking and you're all set!\n\nNeed help with something specific?",
  "i need help with my booking":
    "I'd be happy to help with your booking! 📋\n\nHere's what I can assist with:\n• **Reschedule** — Go to **Bookings** tab → select your booking → click Reschedule\n• **Cancel** — Same path, but click Cancel\n• **Contact provider** — You can message or call them directly\n\nFor urgent issues, please reach out to our support team via WhatsApp or email.",
  "how do providers get verified?":
    "Great question! ✅ Our verification process includes:\n\n1. **Identity Check** — Government-issued ID verification\n2. **Skills Assessment** — Portfolio review & certification check\n3. **Background Check** — Criminal record screening\n4. **Rating System** — Ongoing quality monitoring\n\nAll verified providers get a ✅ badge on their profile!",
  "what are the payment options?":
    "We support multiple payment methods! 💳\n\n• **Card Payment** — Visa, Mastercard, Verve\n• **Bank Transfer** — Direct bank transfer\n• **USSD** — Pay using USSD codes\n• **Wallet** — HANDI Wallet balance\n• **Cash** — Pay cash to the provider\n\nAll online payments are secured with bank-grade encryption 🔒",
  "i want to become a provider":
    "Awesome! We'd love to have you! 🚀\n\nTo become a provider:\n1. Click **Become a Provider** on the homepage\n2. Create your provider profile\n3. Add your services, pricing & availability\n4. Upload relevant certifications\n5. Complete our verification process\n\nOnce verified, you'll start receiving bookings in your area!",
  "how do i cancel a booking?":
    "To cancel a booking: ❌\n\n1. Go to the **Bookings** tab\n2. Find the booking you want to cancel\n3. Click on it to open details\n4. Click the **Cancel Booking** button\n5. Provide a reason (optional)\n\n⚠️ **Note:** Cancellations within 2 hours of the scheduled time may incur a fee.\n\nNeed anything else?",
};

const DEFAULT_RESPONSE =
  "Thanks for your message! 🙏\n\nI'm still learning, but our support team can definitely help you. Here are your options:\n\n📧 **Email:** support@handiwork.ng\n📞 **Phone:** +234 800 000 0000\n💬 **WhatsApp:** Chat with us instantly\n\nOr try one of the quick replies below!";

export default function ChatbotWidget() {
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "👋 Hi there! I'm HANDI Bot.\n\nI can help you with bookings, payments, provider info, and more. Choose a topic below or type your question!",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    const timer = setTimeout(() => setIsVisible(true), 30000);
    return () => clearTimeout(timer);
  }, [isMounted]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getBotResponse = (userMessage: string): string => {
    const key = userMessage.toLowerCase().trim();
    if (BOT_RESPONSES[key]) return BOT_RESPONSES[key];

    // Fuzzy matching
    for (const [question, answer] of Object.entries(BOT_RESPONSES)) {
      const keywords = question.split(" ").filter((w) => w.length > 3);
      const matchCount = keywords.filter((kw) => key.includes(kw)).length;
      if (matchCount >= 2) return answer;
    }

    return DEFAULT_RESPONSE;
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      text: text.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(
      () => {
        const botResponse = getBotResponse(text);
        const botMsg: Message = {
          id: `bot-${Date.now()}`,
          text: botResponse,
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMsg]);
        setIsTyping(false);
      },
      800 + Math.random() * 700,
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  if (!isMounted || !isVisible) return null;

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 z-50 inline-flex items-center justify-center w-14 h-14 rounded-full bg-(--color-primary) text-white shadow-float hover:bg-(--color-primary-dark) transition-all animate-fadeIn cursor-pointer"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
        )}
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-24 left-6 z-50 w-[340px] sm:w-96 bg-white rounded-2xl shadow-float overflow-hidden animate-fadeIn flex flex-col max-h-[70vh]">
          {/* Header */}
          <div className="bg-(--color-primary) text-white p-4 flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Bot size={22} />
            </div>
            <div className="flex-1">
              <h3 className="font-heading font-semibold text-sm">
                HANDI Support
              </h3>
              <p className="text-white/70 text-xs flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full" />
                Online — typically replies instantly
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-white/20 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 min-h-[200px]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                    msg.sender === "user"
                      ? "bg-(--color-primary) text-white rounded-br-md"
                      : "bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-md"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <span
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <span
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          <div className="px-4 py-2 bg-white border-t border-gray-100 shrink-0">
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {QUICK_REPLIES.map((reply) => (
                <button
                  key={reply}
                  onClick={() => sendMessage(reply)}
                  className="shrink-0 px-3 py-1.5 bg-gray-100 hover:bg-(--color-primary-light) text-gray-700 hover:text-(--color-primary) text-xs font-medium rounded-full transition-colors whitespace-nowrap"
                >
                  {reply}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2 shrink-0">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2.5 bg-gray-50 rounded-full text-sm outline-none focus:ring-2 focus:ring-(--color-primary)/20 border border-gray-200"
            />
            <button
              onClick={() => sendMessage(inputValue)}
              disabled={!inputValue.trim()}
              className="w-10 h-10 rounded-full bg-(--color-primary) text-white flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            >
              <Send size={16} />
            </button>
          </div>

          {/* Footer Links */}
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex items-center justify-center gap-4 shrink-0">
            <a
              href="/faq"
              className="text-xs text-gray-500 hover:text-(--color-primary) transition-colors"
            >
              📚 FAQ
            </a>
            <a
              href="/contact"
              className="text-xs text-gray-500 hover:text-(--color-primary) transition-colors"
            >
              📧 Contact
            </a>
            <a
              href="https://wa.me/2348000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-green-600 hover:text-green-700 transition-colors"
            >
              💬 WhatsApp
            </a>
          </div>
        </div>
      )}
    </>
  );
}
