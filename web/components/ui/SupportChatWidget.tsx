"use client";

import { useAuth } from "@/context/AuthContext";
import { MessageCircle, Send, X, Bot, User, Headphones, Mail, Phone, Paperclip, Image as ImageIcon, FileText } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface ChatMessage {
  id: string;
  sender: "user" | "bot" | "agent" | "system";
  text: string;
  timestamp: Date;
  attachment?: { name: string; type: string; url: string };
  options?: string[];
}

// ─── Role-based FAQ knowledge bases ───

const GUEST_FAQS: { keywords: string[]; answer: string }[] = [
  {
    keywords: ["hello", "hi", "hey", "good morning", "good afternoon"],
    answer: "Hello! 👋 Welcome to HANDI.\n\nHow can I help?\n• Booking services\n• Product orders\n• Becoming a provider\n• Selling on HANDI\n\nType **AGENT** to speak with a live agent.",
  },
  { keywords: ["book", "booking", "service"], answer: "To book a service:\n1. Create a free account\n2. Browse services or search\n3. Pick a provider, choose a date\n4. Pay & confirm\n\nType **AGENT** for help." },
  { keywords: ["sign up", "register", "create account", "join"], answer: "Signing up is easy!\n1. Click **Account** → **Sign Up**\n2. Choose Client, Provider, or Vendor\n3. Fill in your details\n\nProviders and vendors go through a quick multi-step setup." },
  { keywords: ["provider", "become", "professional"], answer: "Want to earn on HANDI?\n1. Go to Sign Up → **Provider**\n2. Fill business details\n3. Upload documents\n4. Get verified in 24-48hrs\n\nType **AGENT** for guidance." },
  { keywords: ["sell", "vendor", "store", "product"], answer: "Sell products on HANDI:\n1. Sign Up → **Vendor**\n2. Set up your store\n3. List products\n4. Start selling!\n\nType **AGENT** for help." },
  { keywords: ["price", "cost", "fee", "how much"], answer: "HANDI is free to join!\n• Clients: No fees to browse or book\n• Providers: Small service fee per job\n• Vendors: Commission on sales\n\nFor details, type **AGENT**." },
  { keywords: ["contact", "phone", "email", "call"], answer: "Contact us:\n📞 +234 800 426 3400\n📧 support@handiapp.com.ng\n📍 Port Harcourt, Nigeria\n🌐 handiapp.com.ng" },
];

const CLIENT_FAQS: { keywords: string[]; answer: string }[] = [
  {
    keywords: ["hello", "hi", "hey"],
    answer: "Hello! 👋 How can I help you today?\n\n• Track orders\n• Booking help\n• Payment & refunds\n• Report an issue\n\nType **AGENT** for live support.",
  },
  { keywords: ["order", "track", "delivery", "shipped"], answer: "Track orders: **Dashboard → Orders**\nEach order shows status (Processing → Shipped → Delivered).\n\nFor delays, type **AGENT**." },
  { keywords: ["book", "booking", "cancel", "reschedule"], answer: "Manage bookings: **Dashboard → Bookings**\n• Cancel: Free within 2hrs, fee after\n• Reschedule: Contact provider or type **AGENT**" },
  { keywords: ["pay", "payment", "refund", "wallet"], answer: "Payment help:\n• Cards via Paystack\n• Wallet for quick checkout\n• Refunds: 3-5 business days\n\nIssues? Type **AGENT**." },
  { keywords: ["review", "rate", "feedback"], answer: "Leave reviews:\n1. Go to completed booking/order\n2. Click ⭐ Rate\n3. Share your experience\n\nReviews help other clients!" },
  { keywords: ["wishlist", "save", "favorite"], answer: "Manage your wishlist:\n♥ Click the heart icon on any product/service\n📋 View all: **Dashboard → Wishlist**" },
];

const PROVIDER_FAQS: { keywords: string[]; answer: string }[] = [
  {
    keywords: ["hello", "hi", "hey"],
    answer: "Hello! 👋 Provider support here.\n\n• Wallet & withdrawals\n• Job management\n• Profile verification\n• Dispute resolution\n\nType **AGENT** for live help.",
  },
  { keywords: ["wallet", "withdraw", "balance", "money", "payout"], answer: "Wallet & Withdrawals:\n• View balance: **Dashboard → Wallet**\n• Withdraw: Click Withdraw → enter amount → confirm 2FA\n• Processing: 1-3 business days\n• Min withdrawal: ₦1,000\n\nIssues? Type **AGENT**." },
  { keywords: ["job", "booking", "accept", "decline"], answer: "Manage jobs:\n• New requests appear in **Dashboard → Jobs**\n• Accept or decline within 30 minutes\n• Complete & mark done for payment release" },
  { keywords: ["verify", "verification", "document"], answer: "Get verified:\n1. **Settings → Verification**\n2. Upload ID + certifications\n3. Review: 24-48hrs\n\n✅ Verified badge = more bookings!" },
  { keywords: ["dispute", "complaint", "issue"], answer: "Dispute resolution:\n1. Go to the job/order\n2. Click **Report Issue**\n3. Admin reviews within 24hrs\n\nUrgent? Type **AGENT**." },
];

const ADMIN_FAQS: { keywords: string[]; answer: string }[] = [
  {
    keywords: ["hello", "hi", "hey"],
    answer: "Admin support channel.\n\n• Platform settings\n• User management\n• Dispute escalation\n• System health\n\nType **AGENT** for priority support.",
  },
  { keywords: ["setting", "config", "fee", "commission"], answer: "Platform settings:\n**Admin → Settings**\n• Commission rates\n• Verification rules\n• Feature toggles\n• Fee structure" },
  { keywords: ["user", "ban", "suspend", "lock"], answer: "User management:\n**Admin → Users**\n• Search by email/name\n• Suspend/ban accounts\n• View activity log\n• Reset passwords" },
];

function generateId() {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function getBotResponse(text: string, userType: string | undefined): string {
  const lower = text.toLowerCase().trim();
  let faqs = GUEST_FAQS;
  if (userType === "client") faqs = CLIENT_FAQS;
  else if (userType === "provider" || userType === "vendor") faqs = PROVIDER_FAQS;
  else if (userType === "admin") faqs = ADMIN_FAQS;

  for (const faq of faqs) {
    if (faq.keywords.some((kw) => lower.includes(kw))) return faq.answer;
  }

  return "I'm not sure I understand. Could you rephrase?\n\nType **AGENT** to speak with a live support agent.";
}

function getQuickOptions(userType: string | undefined): string[] {
  if (userType === "provider" || userType === "vendor") return ["Wallet", "Jobs", "Verification", "AGENT"];
  if (userType === "admin") return ["Settings", "Users", "Disputes", "AGENT"];
  if (userType === "client") return ["Orders", "Bookings", "Payments", "AGENT"];
  return ["Services", "Sign Up", "Pricing", "AGENT"];
}

export default function SupportChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [chatMode, setChatMode] = useState<"bot" | "waiting" | "agent" | "collect-contact">("bot");
  const [isTyping, setIsTyping] = useState(false);
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      let greeting = "Hello! 👋 I'm HANDI Bot.";
      if (user?.firstName) greeting = `Hello ${user.firstName}! 👋`;
      if (user?.userType === "provider") greeting += "\n\nProvider support ready. Ask about wallet, jobs, verification.";
      else if (user?.userType === "admin") greeting += "\n\nAdmin channel. Ask about settings, users, disputes.";
      else if (user?.userType === "client") greeting += "\n\nHow can I help? Ask about orders, bookings, payments.";
      else greeting += "\n\nHow can I help? Ask about services, products, or joining HANDI.";
      greeting += "\n\nType **AGENT** for live support.";

      setMessages([{ id: generateId(), sender: "bot", text: greeting, timestamp: new Date(), options: getQuickOptions(user?.userType) }]);
    }
  }, [isOpen, messages.length, user?.firstName, user?.userType]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;

    const userMsg: ChatMessage = { id: generateId(), sender: "user", text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    if (text.toUpperCase() === "AGENT" || text.toUpperCase().includes("SPEAK TO AGENT") || text.toUpperCase().includes("LIVE AGENT") || text.toUpperCase().includes("TALK TO AGENT")) {
      handleAgentEscalation();
      return;
    }

    if (chatMode === "bot") {
      setIsTyping(true);
      setTimeout(() => {
        const response = getBotResponse(text, user?.userType);
        const options = getQuickOptions(user?.userType);
        setMessages((prev) => [...prev, { id: generateId(), sender: "bot", text: response, timestamp: new Date(), options }]);
        setIsTyping(false);
      }, 800 + Math.random() * 600);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const isImage = file.type.startsWith("image/");
    setMessages((prev) => [...prev, {
      id: generateId(), sender: "user",
      text: isImage ? "" : `📎 ${file.name}`,
      timestamp: new Date(),
      attachment: { name: file.name, type: file.type, url }
    }]);
    // Bot acknowledges attachment
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, {
        id: generateId(), sender: "bot",
        text: `Got your file: **${file.name}**\n\nI've noted it. An agent can review this when connected.\n\nType **AGENT** for live support.`,
        timestamp: new Date(),
        options: ["AGENT", "Send another file"]
      }]);
      setIsTyping(false);
    }, 800);
    e.target.value = "";
  };

  const handleQuickOption = (option: string) => {
    setInput(option);
    setTimeout(() => {
      const userMsg: ChatMessage = { id: generateId(), sender: "user", text: option, timestamp: new Date() };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      if (option.toUpperCase() === "AGENT") { handleAgentEscalation(); return; }
      if (option === "Send another file") { fileInputRef.current?.click(); return; }
      setIsTyping(true);
      setTimeout(() => {
        const response = getBotResponse(option, user?.userType);
        const options = getQuickOptions(user?.userType);
        setMessages((prev) => [...prev, { id: generateId(), sender: "bot", text: response, timestamp: new Date(), options }]);
        setIsTyping(false);
      }, 800);
    }, 100);
  };

  const handleAgentEscalation = () => {
    setChatMode("waiting");
    setIsTyping(true);

    setTimeout(() => {
      const agentAvailable = Math.random() > 0.6;

      if (agentAvailable) {
        setMessages((prev) => [...prev, { id: generateId(), sender: "system", text: "🟢 Connecting you to a support agent...", timestamp: new Date() }]);
        setIsTyping(false);
        setTimeout(() => {
          setChatMode("agent");
          setMessages((prev) => [...prev, {
            id: generateId(), sender: "agent",
            text: `Hello${user?.firstName ? ` ${user.firstName}` : ""}! I'm Agent Temi from HANDI Support. How can I assist you?`,
            timestamp: new Date()
          }]);
        }, 1500);
      } else {
        // No agent available — check if user is logged in
        if (user?.email) {
          setMessages((prev) => [...prev, {
            id: generateId(), sender: "system",
            text: `⚠️ All agents are busy.\n\nWe'll follow up via:\n📧 ${user.email}\n📱 Your registered number\n\nExpected response: **within 30 minutes**.\n\nContinue chatting with me in the meantime!`,
            timestamp: new Date()
          }]);
          setChatMode("bot");
        } else {
          // Guest — need contact info
          setMessages((prev) => [...prev, {
            id: generateId(), sender: "system",
            text: "⚠️ All agents are currently busy.\n\nPlease provide your contact details so we can follow up with you:",
            timestamp: new Date()
          }]);
          setChatMode("collect-contact");
        }
        setIsTyping(false);
      }
    }, 2000);
  };

  const handleContactSubmit = () => {
    if (!contactEmail && !contactPhone) return;
    const contactInfo = [
      contactEmail ? `📧 ${contactEmail}` : "",
      contactPhone ? `📱 ${contactPhone}` : "",
    ].filter(Boolean).join("\n");

    setMessages((prev) => [...prev, {
      id: generateId(), sender: "user",
      text: contactInfo,
      timestamp: new Date()
    }]);

    setTimeout(() => {
      setMessages((prev) => [...prev, {
        id: generateId(), sender: "system",
        text: `✅ Got it! A support agent will reach out to you via:\n${contactInfo}\n\nExpected response: **within 30 minutes** during business hours (8am-8pm WAT).\n\nFeel free to continue chatting with me!`,
        timestamp: new Date()
      }]);
      setChatMode("bot");
      setContactEmail("");
      setContactPhone("");
    }, 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const formatTime = (date: Date) => date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <>
      {/* Floating Chat Button — Left Side */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 left-6 w-14 h-14 bg-(--color-primary) hover:bg-emerald-700 text-white rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110 z-40"
          aria-label="Open support chat"
        >
          <MessageCircle size={24} />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
        </button>
      )}

      {/* Chat Panel — Left Side */}
      {isOpen && (
        <div className="fixed bottom-6 left-6 w-[380px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-4rem)] bg-white dark:bg-gray-900 rounded shadow-2xl flex flex-col z-50 overflow-hidden border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="bg-(--color-primary) text-white px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              {chatMode === "agent" ? <Headphones size={20} /> : <Bot size={20} />}
              <div>
                <p className="font-bold text-sm">{chatMode === "agent" ? "Live Agent" : "HANDI Support"}</p>
                <p className="text-[10px] text-white/80">
                  {chatMode === "agent" ? "Agent Temi" : chatMode === "waiting" ? "Connecting..." : "Online · Replies instantly"}
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/20 rounded transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-800">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded px-3 py-2 text-sm leading-relaxed ${
                  msg.sender === "user" ? "bg-(--color-primary) text-white"
                    : msg.sender === "system" ? "bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800"
                    : msg.sender === "agent" ? "bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100 border border-blue-200 dark:border-blue-800"
                    : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-sm border border-gray-100 dark:border-gray-600"
                }`}>
                  {msg.sender !== "user" && (
                    <div className="flex items-center gap-1 mb-1">
                      {msg.sender === "bot" && <Bot size={12} className="text-(--color-primary)" />}
                      {msg.sender === "agent" && <User size={12} className="text-blue-600" />}
                      <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">
                        {msg.sender === "bot" ? "HANDI Bot" : msg.sender === "agent" ? "Agent" : "System"}
                      </span>
                    </div>
                  )}
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  {/* File attachment preview */}
                  {msg.attachment && (
                    msg.attachment.type.startsWith("image/")
                      ? <img src={msg.attachment.url} alt={msg.attachment.name} className="mt-2 max-w-[200px] rounded" />
                      : <div className="mt-2 flex items-center gap-1.5 bg-gray-100 dark:bg-gray-700 px-2 py-1.5 rounded text-xs"><FileText size={12} />{msg.attachment.name}</div>
                  )}
                  {/* Quick reply options */}
                  {msg.options && msg.options.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {msg.options.map((opt) => (
                        <button key={opt} onClick={() => handleQuickOption(opt)}
                          className="px-2.5 py-1 bg-(--color-primary)/10 text-(--color-primary) text-[11px] font-semibold rounded hover:bg-(--color-primary)/20 transition-colors cursor-pointer border border-(--color-primary)/20"
                        >{opt}</button>
                      ))}
                    </div>
                  )}
                  <p className={`text-[9px] mt-1 ${msg.sender === "user" ? "text-white/60" : "opacity-40"}`}>{formatTime(msg.timestamp)}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-700 rounded px-4 py-3 shadow-sm border border-gray-100 dark:border-gray-600">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Contact Collection Form (for guests) */}
          {chatMode === "collect-contact" ? (
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shrink-0 space-y-2">
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">How should we reach you?</p>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-gray-400 shrink-0" />
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="Email address"
                  className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-(--color-primary)"
                />
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-gray-400 shrink-0" />
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="Phone / WhatsApp number"
                  className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-(--color-primary)"
                />
              </div>
              <button
                onClick={handleContactSubmit}
                disabled={!contactEmail && !contactPhone}
                className="w-full py-2 bg-(--color-primary) text-white text-sm font-semibold hover:opacity-90 disabled:opacity-40 transition-opacity"
              >
                Submit & Get Follow-Up
              </button>
            </div>
          ) : (
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shrink-0">
              <div className="flex items-center gap-2">
                {/* File Upload */}
                <input ref={fileInputRef} type="file" className="hidden" accept="image/*,.pdf,.doc,.docx,.txt" onChange={handleFileUpload} />
                <button onClick={() => fileInputRef.current?.click()} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-400 hover:text-(--color-primary) cursor-pointer" title="Attach file">
                  <Paperclip size={16} />
                </button>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value.slice(0, 500))}
                  onKeyDown={handleKeyDown}
                  placeholder={chatMode === "waiting" ? "Please wait..." : "Type a message..."}
                  disabled={chatMode === "waiting"}
                  maxLength={500}
                  className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-(--color-primary) disabled:opacity-50 placeholder:text-gray-400"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || chatMode === "waiting"}
                  className="w-10 h-10 bg-(--color-primary) text-white rounded-full flex items-center justify-center hover:bg-emerald-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                >
                  <Send size={16} />
                </button>
              </div>
              <div className="flex items-center justify-between mt-1.5">
                <p className="text-[9px] text-gray-400">
                  Type <span className="font-bold text-(--color-primary)">AGENT</span> for live support
                </p>
                <span className="text-[9px] text-gray-400">{input.length}/500</span>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
