"use client";

import React, { useState, useEffect } from 'react';
import './SharedStarfield.css';

const SharedStarfield = () => {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const generateStars = () => {
      const newStars = [];
      const numStars = 100; // Yıldız sayısı
      for (let i = 0; i < numStars; i++) {
        const size = Math.random() * 2 + 1; // 1px ile 3px arası boyut
        const duration = Math.random() * 8 + 6; // 6s ile 14s arası animasyon süresi
        const delay = Math.random() * 8; // 0s ile 8s arası gecikme

        newStars.push({
          id: i,
          style: {
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${size}px`,
            height: `${size}px`,
            animationDuration: `${duration}s`,
            animationDelay: `${delay}s`,
          },
        });
      }
      setStars(newStars);
    };

    generateStars();
  }, []); // Boş dependency array'i sayesinde bu kod sadece bir kez, client'da çalışır

  return (
    <div className="starfield-container">
      {stars.map((star) => (
        <span key={star.id} className="starfield-star" style={star.style}></span>
      ))}
    </div>
  );
};

export default SharedStarfield;