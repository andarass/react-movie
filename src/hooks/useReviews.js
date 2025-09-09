import { useState, useEffect } from "react";

export function useReviews(key = "reviews") {
  const [reviews, setReviews] = useState({});

  // ambil dari localStorage saat load
  useEffect(() => {
    const saved = localStorage.getItem(key);
    if (saved) setReviews(JSON.parse(saved));
  }, [key]);

  // simpan ke localStorage tiap ada perubahan
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(reviews));
  }, [reviews, key]);

  function addReview(movieId, text) {
    setReviews(prev => {
      const movieReviews = prev[movieId] || [];
      return {
        ...prev,
        [movieId]: [...movieReviews, { text, date: new Date().toISOString() }]
      };
    });
  }

  return { reviews, addReview };
}
