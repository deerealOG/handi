// constants/faqData.ts
// Shared FAQ data for use across web and native apps

export interface FAQItem {
  question: string;
  answer: string;
  category: "general" | "clients" | "providers" | "payments" | "safety";
}

export const FAQ_DATA: FAQItem[] = [
  // General Questions
  {
    question: "What is HANDI?",
    answer:
      "HANDI is a platform that connects you with trusted local service providers in Nigeria. Whether you need a plumber, electrician, hairdresser, or cleaner, we help you find verified professionals near you.",
    category: "general",
  },
  {
    question: "Is HANDI available in my city?",
    answer:
      "HANDI is currently available in Lagos, Abuja, Port Harcourt, and Ibadan. We're expanding to more cities soon. Download the app to check availability in your area.",
    category: "general",
  },
  {
    question: "How do I download the HANDI app?",
    answer:
      "You can download the HANDI app from the Google Play Store or Apple App Store. Search for 'HANDI' or click the download button on our website.",
    category: "general",
  },

  // Client Questions
  {
    question: "How do I book a service?",
    answer:
      "1. Browse or search for the service you need\n2. Select a provider based on ratings and reviews\n3. Choose your preferred date and time\n4. Confirm your booking and make payment\n5. The provider will arrive at the scheduled time",
    category: "clients",
  },
  {
    question: "Can I cancel a booking?",
    answer:
      "Yes, you can cancel a booking from the 'Bookings' tab. Cancellations made more than 2 hours before the scheduled time are free. Later cancellations may incur a small fee.",
    category: "clients",
  },
  {
    question: "How do I rate a service provider?",
    answer:
      "After your service is completed, you'll receive a notification to rate your experience. You can give a 1-5 star rating and leave a review. Your feedback helps other users make informed decisions.",
    category: "clients",
  },
  {
    question: "What if I'm not satisfied with the service?",
    answer:
      "If you're not satisfied, please contact our support team within 24 hours. We'll investigate the issue and may offer a refund or free re-service depending on the situation.",
    category: "clients",
  },

  // Provider Questions
  {
    question: "How do I become a service provider on HANDI?",
    answer:
      "1. Download the HANDI app and sign up as a Provider\n2. Complete your profile with your skills and experience\n3. Submit required verification documents (ID, certifications)\n4. Pass our background check\n5. Once approved, you can start accepting jobs",
    category: "providers",
  },
  {
    question: "How do I get paid?",
    answer:
      "Payments are deposited to your HANDI wallet after each completed job. You can withdraw to your bank account at any time. Withdrawals are processed within 24 hours.",
    category: "providers",
  },
  {
    question: "What fees does HANDI charge?",
    answer:
      "HANDI charges a 15% service fee on each completed job. This covers platform maintenance, payment processing, and customer support. There are no upfront or monthly fees.",
    category: "providers",
  },
  {
    question: "Can I set my own prices?",
    answer:
      "Yes! You have full control over your pricing. Set your hourly rate or fixed prices for specific services. Competitive pricing can help you attract more clients.",
    category: "providers",
  },

  // Payment Questions
  {
    question: "What payment methods are accepted?",
    answer:
      "We accept bank cards (Visa, Mastercard), bank transfers, and mobile money (Paga, OPay). All payments are processed securely through Paystack.",
    category: "payments",
  },
  {
    question: "Is my payment information secure?",
    answer:
      "Yes, absolutely. We use industry-standard encryption and never store your full card details. All transactions are processed through PCI-DSS compliant payment providers.",
    category: "payments",
  },
  {
    question: "Can I get a refund?",
    answer:
      "Refunds are available for cancelled services and unsatisfactory work. Contact our support team with your booking details, and we'll process your refund within 3-5 business days.",
    category: "payments",
  },

  // Safety Questions
  {
    question: "How are service providers verified?",
    answer:
      "All providers undergo a thorough verification process including:\n• Government ID verification\n• Professional certification checks\n• Background/criminal record check\n• Reference verification\n• Face-to-face or video interview",
    category: "safety",
  },
  {
    question: "What safety measures are in place?",
    answer:
      "• All providers are background-checked\n• Real-time tracking during service\n• In-app emergency button\n• Secure in-app payments (no cash needed)\n• Rating and review system\n• 24/7 customer support",
    category: "safety",
  },
  {
    question: "What should I do in an emergency?",
    answer:
      "Use the emergency button in the app to alert our safety team immediately. For life-threatening emergencies, please call 112 (Nigeria emergency line) first, then notify us.",
    category: "safety",
  },
];

export const FAQ_CATEGORIES = [
  { id: "general", label: "General", icon: "help-circle-outline" },
  { id: "clients", label: "For Clients", icon: "account-outline" },
  { id: "providers", label: "For Providers", icon: "briefcase-outline" },
  { id: "payments", label: "Payments", icon: "credit-card-outline" },
  { id: "safety", label: "Safety", icon: "shield-check-outline" },
] as const;
