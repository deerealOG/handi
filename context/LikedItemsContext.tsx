// context/LikedItemsContext.tsx
// Context for managing liked artisans and businesses

import { ArtisanData } from '@/components/EnhancedArtisanCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface LikedItemsContextType {
  likedItems: ArtisanData[];
  isLiked: (id: string | number) => boolean;
  toggleLike: (item: ArtisanData) => void;
  clearAll: () => void;
}

const LikedItemsContext = createContext<LikedItemsContextType>({
  likedItems: [],
  isLiked: () => false,
  toggleLike: () => {},
  clearAll: () => {},
});

const STORAGE_KEY = 'liked_items';

export function LikedItemsProvider({ children }: { children: React.ReactNode }) {
  const [likedItems, setLikedItems] = useState<ArtisanData[]>([]);

  useEffect(() => {
    loadLikedItems();
  }, []);

  const loadLikedItems = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setLikedItems(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading liked items:', error);
    }
  };

  const saveLikedItems = async (items: ArtisanData[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving liked items:', error);
    }
  };

  const isLiked = (id: string | number): boolean => {
    return likedItems.some(item => item.id === id);
  };

  const toggleLike = (item: ArtisanData) => {
    setLikedItems(prev => {
      const exists = prev.some(i => i.id === item.id);
      let newItems: ArtisanData[];
      if (exists) {
        newItems = prev.filter(i => i.id !== item.id);
      } else {
        newItems = [...prev, item];
      }
      saveLikedItems(newItems);
      return newItems;
    });
  };

  const clearAll = () => {
    setLikedItems([]);
    saveLikedItems([]);
  };

  return (
    <LikedItemsContext.Provider value={{ likedItems, isLiked, toggleLike, clearAll }}>
      {children}
    </LikedItemsContext.Provider>
  );
}

export const useLikedItems = () => useContext(LikedItemsContext);

export default LikedItemsContext;
