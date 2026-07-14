"use client";

import { useEffect, useState, useCallback } from "react";

const slides: string[] = [
  "/assets/images/terminal hero.webp",
  "/assets/images/kelabba-maja.webp",
  "/assets/images/Terminal.webp",
];

export function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000); // Auto slide every 6 seconds
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section className="hero" id="hero">
      <div className="hero__slider">
        {slides.map((bgImage, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={index}
              className={`hero__slide ${isActive ? "hero__slide--active" : ""}`}
            >
              <div
                className="hero__slide-bg"
                style={{ backgroundImage: `url('${bgImage}')` }}
              ></div>
              <div className="hero__overlay"></div>
            </div>
          );
        })}
      </div>

      <div className="hero__content">
        <p className="hero__greeting">Selamat Datang di</p>
        <h1 className="hero__title">Bandar Udara Tardamu Sabu Raijua</h1>
        <div className="hero__divider">
          <span></span>
          <p>Gerbang Wisata Negeri Seribu Lontar</p>
          <span></span>
        </div>
      </div>
    </section>
  );
}

