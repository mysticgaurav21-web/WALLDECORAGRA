/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Category, EnquiryBasketItem } from '../types';
import { PRODUCTS, CATEGORIES } from '../data/mockData';

interface AppContextType {
  basket: EnquiryBasketItem[];
  favourites: string[];
  addToBasket: (product: Product, quantity: number) => void;
  removeFromBasket: (productId: string) => void;
  updateBasketQuantity: (productId: string, quantity: number) => void;
  clearBasket: () => void;
  toggleFavourite: (productId: string) => void;
  isFavourite: (productId: string) => boolean;
  recentSearches: string[];
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  submitMessage: { type: 'success' | 'error'; text: string; refNo?: string } | null;
  setSubmitMessage: (msg: { type: 'success' | 'error'; text: string; refNo?: string } | null) => void;
  products: Product[];
  categories: Category[];
  addProduct: (product: Product) => void;
  editProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [basket, setBasket] = useState<EnquiryBasketItem[]>([]);
  const [favourites, setFavourites] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string; refNo?: string } | null>(null);

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('wd99_products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing saved products', e);
      }
    }
    return PRODUCTS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('wd99_categories');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing saved categories', e);
      }
    }
    return CATEGORIES;
  });

  // Load from LocalStorage
  useEffect(() => {
    const savedBasket = localStorage.getItem('wd99_basket');
    if (savedBasket) {
      try {
        setBasket(JSON.parse(savedBasket));
      } catch (e) {
        console.error('Error loading basket', e);
      }
    }

    const savedFavourites = localStorage.getItem('wd99_favourites');
    if (savedFavourites) {
      try {
        setFavourites(JSON.parse(savedFavourites));
      } catch (e) {
        console.error('Error loading favourites', e);
      }
    }

    const savedSearches = localStorage.getItem('wd99_recent_searches');
    if (savedSearches) {
      try {
        setRecentSearches(JSON.parse(savedSearches));
      } catch (e) {
        console.error('Error loading recent searches', e);
      }
    }
  }, []);

  // Save to LocalStorage
  const saveBasket = (newBasket: EnquiryBasketItem[]) => {
    setBasket(newBasket);
    localStorage.setItem('wd99_basket', JSON.stringify(newBasket));
  };

  const saveFavourites = (newFavourites: string[]) => {
    setFavourites(newFavourites);
    localStorage.setItem('wd99_favourites', JSON.stringify(newFavourites));
  };

  const addToBasket = (product: Product, quantity: number) => {
    const existing = basket.find((item) => item.product.id === product.id);
    if (existing) {
      const newQuantity = existing.quantity + quantity;
      updateBasketQuantity(product.id, newQuantity);
    } else {
      const newBasket = [...basket, { product, quantity }];
      saveBasket(newBasket);
    }
  };

  const removeFromBasket = (productId: string) => {
    const newBasket = basket.filter((item) => item.product.id !== productId);
    saveBasket(newBasket);
  };

  const updateBasketQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromBasket(productId);
      return;
    }
    const newBasket = basket.map((item) =>
      item.product.id === productId ? { ...item, quantity } : item
    );
    saveBasket(newBasket);
  };

  const clearBasket = () => {
    saveBasket([]);
  };

  const toggleFavourite = (productId: string) => {
    let newFavs: string[];
    if (favourites.includes(productId)) {
      newFavs = favourites.filter((id) => id !== productId);
    } else {
      newFavs = [...favourites, productId];
    }
    saveFavourites(newFavs);
  };

  const isFavourite = (productId: string) => {
    return favourites.includes(productId);
  };

  const addRecentSearch = (query: string) => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return;
    const filtered = recentSearches.filter((s) => s.toLowerCase() !== trimmed);
    const newSearches = [query, ...filtered].slice(0, 5); // keep last 5
    setRecentSearches(newSearches);
    localStorage.setItem('wd99_recent_searches', JSON.stringify(newSearches));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('wd99_recent_searches');
  };

  const addProduct = (product: Product) => {
    const updated = [product, ...products];
    setProducts(updated);
    localStorage.setItem('wd99_products', JSON.stringify(updated));
  };

  const editProduct = (updatedProduct: Product) => {
    const updated = products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p));
    setProducts(updated);
    localStorage.setItem('wd99_products', JSON.stringify(updated));
  };

  const deleteProduct = (productId: string) => {
    const updated = products.filter((p) => p.id !== productId);
    setProducts(updated);
    localStorage.setItem('wd99_products', JSON.stringify(updated));
  };

  return (
    <AppContext.Provider
      value={{
        basket,
        favourites,
        addToBasket,
        removeFromBasket,
        updateBasketQuantity,
        clearBasket,
        toggleFavourite,
        isFavourite,
        recentSearches,
        addRecentSearch,
        clearRecentSearches,
        submitMessage,
        setSubmitMessage,
        products,
        categories,
        addProduct,
        editProduct,
        deleteProduct,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
