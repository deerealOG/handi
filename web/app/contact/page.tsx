"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import {
    ChevronDown,
    Clock,
    Headphones,
    Mail,
    MessageSquare,
    Phone,
    Send,
    User,
} from "lucide-react";
import { useState } from "react";

const CONTACT_INFO = [
  {
    icon: Phone,
    title: "Phone Number",
    details: ["+234 800 HANDI (42634)", "+234 (0) 1 234 5678"],
  },
  {
    icon: Mail,
    title: "Email Address",
    details: ["support@handiapp.com.ng"],
  },
  {
    icon: Headphones,
    title: "We're Online 24/7",
    details: ["Always available to help you", "Quick response guaranteed"],
  },
];

const INQUIRY_SUBJECTS = [
  "General Inquiry",
  "Booking Issues",
  "Provider Support",
  "Billing & Payments",
  "Technical Support",
  "Feedback & Suggestions",
  "Partnership Opportunities",
  "Other",
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-[var(--color-primary)] py-16 lg:py-20 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="font-heading text-3xl lg:text-5xl text-white mb-4">
          Contact Us
        </h1>
        <p className="text-white/90 text-lg max-w-xl mx-auto">
          Have questions? We&apos;d love to hear from you. Send us a message and
          we&apos;ll respond as soon as possible.
        </p>
      </section>

      {/* Contact Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white p-8 rounded-2xl shadow-card">
              <div className="flex items-center gap-3 mb-6">
                <MessageSquare
                  size={24}
                  className="text-[var(--color-primary)]"
                />
                <h2 className="font-heading text-xl font-semibold">
                  Send us a Message
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {submitted && (
                  <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 text-sm flex items-center gap-2">
                    ✅ Thank you for your message! We&apos;ll get back to you
                    soon.
                  </div>
                )}
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      First Name
                    </label>
                    <div className="relative">
                      <User
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            firstName: e.target.value,
                          })
                        }
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-full focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none transition-all"
                        placeholder="John"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Last Name
                    </label>
                    <div className="relative">
                      <User
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-full focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none transition-all"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-full focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-full focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none transition-all"
                      placeholder="+234 800 000 0000"
                    />
                  </div>
                </div>

                {/* Subject Dropdown */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Subject of Inquiry
                  </label>
                  <div className="relative">
                    <select
                      required
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-full focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none transition-all appearance-none bg-white cursor-pointer"
                    >
                      <option value="">Select a subject...</option>
                      {INQUIRY_SUBJECTS.map((subject) => (
                        <option key={subject} value={subject}>
                          {subject}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={18}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none transition-all resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 h-12 bg-[var(--color-primary)] text-white rounded-[50px] font-semibold hover:bg-[var(--color-primary-dark)] transition-colors"
                >
                  <Send size={18} />
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              {CONTACT_INFO.map((info) => (
                <div
                  key={info.title}
                  className="bg-white p-6 rounded-2xl shadow-card flex gap-4 hover:shadow-float transition-shadow"
                >
                  <div className="w-14 h-14 rounded-xl bg-[var(--color-primary-light)] flex items-center justify-center shrink-0">
                    <info.icon
                      size={26}
                      className="text-[var(--color-primary)]"
                    />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold mb-1 text-lg">
                      {info.title}
                    </h3>
                    {info.details.map((detail, idx) => (
                      <p
                        key={idx}
                        className="text-[var(--color-muted)] text-sm"
                      >
                        {detail}
                      </p>
                    ))}
                  </div>
                </div>
              ))}

              {/* Quick Help Banner */}
              <div className="bg-[var(--color-secondary)] p-6 rounded-2xl text-center">
                <Clock size={32} className="mx-auto mb-3 text-gray-900" />
                <h3 className="font-heading font-semibold text-lg text-gray-900 mb-2">
                  Need Help Right Now?
                </h3>
                <p className="text-gray-700 text-sm mb-4">
                  Our support team is available 24/7 to assist you with any
                  questions or concerns.
                </p>
                <a
                  href="tel:+2348004263"
                  className="inline-flex items-center justify-center gap-2 h-10 px-6 bg-gray-900 text-white rounded-[50px] font-medium hover:bg-gray-800 transition-colors"
                >
                  <Phone size={16} />
                  Call Us Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
