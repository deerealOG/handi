// context/LanguageContext.tsx
// Multi-language support with English and Nigerian Pidgin

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

// ================================
// Types
// ================================
export type Language = 'en' | 'pidgin';

interface Translations {
  [key: string]: {
    en: string;
    pidgin: string;
  };
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  languageName: string;
}

// ================================
// Translations Dictionary
// ================================
const translations: Translations = {
  // Navigation & Common
  home: { en: 'Home', pidgin: 'Home' },
  explore: { en: 'Explore', pidgin: 'Find Person' },
  bookings: { en: 'Bookings', pidgin: 'My Bookings' },
  wallet: { en: 'Wallet', pidgin: 'My Money' },
  profile: { en: 'Profile', pidgin: 'My Profile' },
  settings: { en: 'Settings', pidgin: 'Settings' },
  back: { en: 'Back', pidgin: 'Go Back' },
  
  // Greetings
  welcome: { en: 'Welcome', pidgin: 'How far' },
  hello: { en: 'Hello', pidgin: 'Hey' },
  goodMorning: { en: 'Good Morning', pidgin: 'Good Morning o' },
  goodAfternoon: { en: 'Good Afternoon', pidgin: 'Afternoon o' },
  goodEvening: { en: 'Good Evening', pidgin: 'Evening o' },
  
  // Home Screen
  whatDoYouNeed: { en: 'What do you need help with?', pidgin: 'Wetin you wan do?' },
  searchArtisans: { en: 'Search for artisans...', pidgin: 'Find handiman...' },
  topRated: { en: 'Top Rated', pidgin: 'Best People' },
  nearYou: { en: 'Near You', pidgin: 'Close to You' },
  allCategories: { en: 'All Categories', pidgin: 'All Work' },
  seeAll: { en: 'See All', pidgin: 'See All' },
  
  // Artisan Related
  verified: { en: 'Verified', pidgin: 'Verified' },
  certifiedPro: { en: 'Verified Pro', pidgin: 'Master' },
  backgroundChecked: { en: 'Background Checked', pidgin: 'Person wey dem check well well' },
  idVerified: { en: 'ID Verified', pidgin: 'ID dey' },
  unverified: { en: 'Unverified', pidgin: 'No verification yet' },
  rating: { en: 'Rating', pidgin: 'Rating' },
  reviews: { en: 'reviews', pidgin: 'people talk' },
  experience: { en: 'experience', pidgin: 'experience' },
  yearsExp: { en: 'years experience', pidgin: 'years for the work' },
  jobsCompleted: { en: 'Jobs Completed', pidgin: 'Work wey dem do' },
  responseTime: { en: 'Response Time', pidgin: 'How fast dem dey reply' },
  
  // Booking
  bookNow: { en: 'Book Now', pidgin: 'Book Am Now' },
  bookService: { en: 'Book Service', pidgin: 'Book Work' },
  confirmBooking: { en: 'Confirm Booking', pidgin: 'Confirm Am' },
  cancelBooking: { en: 'Cancel Booking', pidgin: 'Cancel Am' },
  bookingSuccess: { en: 'Booking Successful!', pidgin: 'E don work!' },
  bookingPending: { en: 'Pending', pidgin: 'Dey wait' },
  bookingInProgress: { en: 'In Progress', pidgin: 'Work dey go on' },
  bookingCompleted: { en: 'Completed', pidgin: 'Done Done' },
  
  // Emergency
  emergency: { en: 'Emergency', pidgin: 'Urgent!' },
  emergencyService: { en: 'Emergency Service', pidgin: 'Fast Fast Work' },
  available24_7: { en: 'Available 24/7', pidgin: 'Anytime Available' },
  priorityBooking: { en: 'Priority Booking', pidgin: 'First First Booking' },
  
  // Prices
  from: { en: 'From', pidgin: 'From' },
  price: { en: 'Price', pidgin: 'Price' },
  totalPrice: { en: 'Total Price', pidgin: 'All the Money' },
  payNow: { en: 'Pay Now', pidgin: 'Pay Now' },
  
  // Location
  nearMe: { en: 'Near me', pidgin: 'Near me' },
  location: { en: 'Location', pidgin: 'Where you dey' },
  distance: { en: 'Distance', pidgin: 'How far' },
  currentLocation: { en: 'Current Location', pidgin: 'Where I dey now' },
  
  // Filters
  filter: { en: 'Filter', pidgin: 'Filter' },
  applyFilters: { en: 'Apply Filters', pidgin: 'Use Filter' },
  clearFilters: { en: 'Clear Filters', pidgin: 'Clear Am' },
  verifiedOnly: { en: 'Verified Only', pidgin: 'Only Verified People' },
  priceRange: { en: 'Price Range', pidgin: 'Price Range' },
  minimumRating: { en: 'Minimum Rating', pidgin: 'At Least This Rating' },
  
  // Chat
  sendMessage: { en: 'Send Message', pidgin: 'Send Message' },
  typeMessage: { en: 'Type a message...', pidgin: 'Write something...' },
  
  // Profile
  editProfile: { en: 'Edit Profile', pidgin: 'Change My Info' },
  myBookings: { en: 'My Bookings', pidgin: 'My Bookings' },
  favorites: { en: 'Favorites', pidgin: 'People I Like' },
  helpSupport: { en: 'Help & Support', pidgin: 'Help' },
  logout: { en: 'Logout', pidgin: 'Comot' },
  
  // Settings
  appearance: { en: 'Appearance', pidgin: 'How E Look' },
  darkMode: { en: 'Dark Mode', pidgin: 'Dark Mode' },
  lightMode: { en: 'Light Mode', pidgin: 'Light Mode' },
  systemDefault: { en: 'System Default', pidgin: 'Follow Phone' },
  language: { en: 'Language', pidgin: 'Language' },
  notifications: { en: 'Notifications', pidgin: 'Notifications' },
  privacy: { en: 'Privacy', pidgin: 'Privacy' },
  
  // Referral
  referFriend: { en: 'Refer a Friend', pidgin: 'Tell Your Padi' },
  referralCode: { en: 'Your Referral Code', pidgin: 'Your Code' },
  copyCode: { en: 'Copy Code', pidgin: 'Copy Am' },
  shareCode: { en: 'Share Code', pidgin: 'Share Am' },
  referralBonus: { en: 'Get ₦500 for each friend!', pidgin: 'Get ₦500 for each padi!' },
  friendsReferred: { en: 'Friends Referred', pidgin: 'Padis Wey You Bring' },
  totalEarned: { en: 'Total Earned', pidgin: 'Money Wey You Earn' },
  
  // Auth
  login: { en: 'Login', pidgin: 'Enter' },
  register: { en: 'Register', pidgin: 'Sign Up' },
  forgotPassword: { en: 'Forgot Password?', pidgin: 'Forget Password?' },
  email: { en: 'Email', pidgin: 'Email' },
  password: { en: 'Password', pidgin: 'Password' },
  confirmPassword: { en: 'Confirm Password', pidgin: 'Type Password Again' },
  
  // General
  loading: { en: 'Loading...', pidgin: 'Wait small...' },
  error: { en: 'Error', pidgin: 'Problem' },
  success: { en: 'Success', pidgin: 'E work!' },
  cancel: { en: 'Cancel', pidgin: 'Cancel' },
  confirm: { en: 'Confirm', pidgin: 'Confirm' },
  save: { en: 'Save', pidgin: 'Save' },
  delete: { en: 'Delete', pidgin: 'Delete' },
  edit: { en: 'Edit', pidgin: 'Change' },
  done: { en: 'Done', pidgin: 'Finish' },
  next: { en: 'Next', pidgin: 'Next' },
  previous: { en: 'Previous', pidgin: 'Back' },
  submit: { en: 'Submit', pidgin: 'Send Am' },
  retry: { en: 'Retry', pidgin: 'Try Again' },
  close: { en: 'Close', pidgin: 'Close' },
  yes: { en: 'Yes', pidgin: 'Yes' },
  no: { en: 'No', pidgin: 'No' },
};

// ================================
// Context
// ================================
const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
  languageName: 'English',
});

// ================================
// Provider
// ================================
export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLang = await AsyncStorage.getItem('user-language');
      if (savedLang === 'en' || savedLang === 'pidgin') {
        setLanguageState(savedLang);
      }
    } catch (error) {
      console.log('Error loading language:', error);
    }
  };

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    try {
      await AsyncStorage.setItem('user-language', lang);
    } catch (error) {
      console.log('Error saving language:', error);
    }
  };

  const t = (key: string): string => {
    const translation = translations[key];
    if (translation) {
      return translation[language];
    }
    // Return key if translation not found
    return key;
  };

  const languageName = language === 'en' ? 'English' : 'Pidgin';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languageName }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

export default LanguageContext;
