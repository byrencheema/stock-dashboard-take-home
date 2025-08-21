import { useState, useEffect } from 'react';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    const stored = localStorage.getItem('stockFavorites');
    return stored ? new Set(JSON.parse(stored)) : new Set();
  });

  useEffect(() => {
    localStorage.setItem('stockFavorites', JSON.stringify(Array.from(favorites)));
  }, [favorites]);

  const toggleFavorite = (symbol: string) => {
    setFavorites(prev => {
      const updated = new Set(prev);
      if (updated.has(symbol)) {
        updated.delete(symbol);
      } else {
        updated.add(symbol);
      }
      return updated;
    });
  };

  return { favorites, toggleFavorite };
};