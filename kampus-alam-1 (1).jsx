import { useState, useEffect, useRef, useCallback } from "react";

const COLORS = {
  forestGreen: "#4E7D22",
  leafGreen: "#6F9D36",
  earthBrown: "#3D2415",
  natureBlue: "#2F6FC4",
  lightGray: "#D8D6D1",
  white: "#FFFFFF",
};

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;0,9..144,700;0,9..144,900;1,9..144,300;1,9..144,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

  :root {
    --forest: #4E7D22;
    --leaf: #6F9D36;
    --brown: #3D2415;
    --blue: #2F6FC4;
    --lgray: #D8D6D1;
    --white: #FFFFFF;
    --dark-bg: #0d1a07;
    --dark-surface: #141f0a;
    --dark-card: #1a2a0e;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  html { scroll-behavior: smooth; }

  body {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: var(--white);
    color: var(--brown);
    overflow-x: hidden;
    transition: background 0.4s, color 0.4s;
  }

  body.dark {
    background: var(--dark-bg);
    color: #e8f5d4;
  }

  .font-display { font-family: 'Fraunces', serif; }

  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    33% { transform: translateY(-18px) rotate(5deg); }
    66% { transform: translateY(-8px) rotate(-3deg); }
  }

  @keyframes floatReverse {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    33% { transform: translateY(12px) rotate(-4deg); }
    66% { transform: translateY(20px) rotate(6deg); }
  }

  @keyframes leafDrift {
    0% { transform: translateX(-10px) rotate(0deg) translateY(0px); opacity: 0; }
    10% { opacity: 0.8; }
    90% { opacity: 0.6; }
    100% { transform: translateX(110vw) rotate(720deg) translateY(60px); opacity: 0; }
  }

  @keyframes pulse-ring {
    0% { transform: scale(0.8); opacity: 1; }
    100% { transform: scale(2.2); opacity: 0; }
  }

  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  @keyframes countUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(40px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeInLeft {
    from { opacity: 0; transform: translateX(-40px); }
    to { opacity: 1; transform: translateX(0); }
  }

  @keyframes fadeInRight {
    from { opacity: 0; transform: translateX(40px); }
    to { opacity: 1; transform: translateX(0); }
  }

  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.85); }
    to { opacity: 1; transform: scale(1); }
  }

  @keyframes rotateSlow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes morphBlob {
    0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
    25% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
    50% { border-radius: 50% 60% 30% 60% / 40% 30% 70% 60%; }
    75% { border-radius: 70% 30% 60% 40% / 60% 70% 30% 40%; }
  }

  @keyframes gradientShift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }

  .animate-float { animation: float 6s ease-in-out infinite; }
  .animate-float-reverse { animation: floatReverse 7s ease-in-out infinite; }
  .animate-pulse-ring { animation: pulse-ring 2.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite; }
  .animate-rotate-slow { animation: rotateSlow 20s linear infinite; }
  .animate-morph-blob { animation: morphBlob 8s ease-in-out infinite; }

  .reveal { opacity: 0; transform: translateY(40px); transition: opacity 0.7s ease, transform 0.7s ease; }
  .reveal.visible { opacity: 1; transform: translateY(0); }
  .reveal-left { opacity: 0; transform: translateX(-40px); transition: opacity 0.7s ease, transform 0.7s ease; }
  .reveal-left.visible { opacity: 1; transform: translateX(0); }
  .reveal-right { opacity: 0; transform: translateX(40px); transition: opacity 0.7s ease, transform 0.7s ease; }
  .reveal-right.visible { opacity: 1; transform: translateX(0); }
  .reveal-scale { opacity: 0; transform: scale(0.9); transition: opacity 0.6s ease, transform 0.6s ease; }
  .reveal-scale.visible { opacity: 1; transform: scale(1); }

  .glass {
    background: rgba(255,255,255,0.12);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,0.2);
  }

  .glass-dark {
    background: rgba(0,0,0,0.25);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,0.1);
  }

  .text-gradient {
    background: linear-gradient(135deg, var(--forest), var(--leaf), var(--blue));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .text-gradient-warm {
    background: linear-gradient(135deg, var(--leaf), var(--forest));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .btn-primary {
    background: linear-gradient(135deg, var(--forest), var(--leaf));
    color: white;
    padding: 14px 32px;
    border-radius: 50px;
    font-weight: 600;
    font-size: 0.95rem;
    letter-spacing: 0.02em;
    border: none;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    position: relative;
    overflow: hidden;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .btn-primary::before {
    content: '';
    position: absolute;
    top: 0; left: -100%;
    width: 100%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s;
  }

  .btn-primary:hover::before { left: 100%; }

  .btn-primary:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 12px 32px rgba(78, 125, 34, 0.4);
  }

  .btn-secondary {
    background: transparent;
    color: var(--forest);
    padding: 13px 32px;
    border-radius: 50px;
    font-weight: 600;
    font-size: 0.95rem;
    border: 2px solid var(--forest);
    cursor: pointer;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .btn-secondary:hover {
    background: var(--forest);
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(78, 125, 34, 0.3);
  }

  .btn-outline-white {
    background: transparent;
    color: white;
    padding: 13px 32px;
    border-radius: 50px;
    font-weight: 600;
    border: 2px solid rgba(255,255,255,0.7);
    cursor: pointer;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .btn-outline-white:hover {
    background: white;
    color: var(--forest);
    transform: translateY(-2px);
  }

  .card-hover {
    transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.35s ease;
  }

  .card-hover:hover {
    transform: translateY(-8px);
    box-shadow: 0 24px 48px rgba(78, 125, 34, 0.15);
  }

  .nav-link {
    position: relative;
    font-weight: 500;
    transition: color 0.3s;
  }

  .nav-link::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 2px;
    background: var(--leaf);
    transition: width 0.3s ease;
    border-radius: 2px;
  }

  .nav-link:hover::after { width: 100%; }

  .hero-gradient {
    background: linear-gradient(160deg,
      #0a1f04 0%,
      #1a3d08 20%,
      #2d5a15 40%,
      #1e4a2a 60%,
      #0f2d1a 80%,
      #061508 100%
    );
  }

  .section-divider {
    width: 60px;
    height: 4px;
    background: linear-gradient(90deg, var(--forest), var(--leaf));
    border-radius: 2px;
    margin: 0 auto 16px;
  }

  .section-divider-left {
    width: 60px;
    height: 4px;
    background: linear-gradient(90deg, var(--forest), var(--leaf));
    border-radius: 2px;
    margin-bottom: 16px;
  }

  .leaf-particle {
    position: absolute;
    animation: leafDrift linear infinite;
    pointer-events: none;
  }

  input, textarea, select {
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--leaf); border-radius: 3px; }

  .parallax-layer {
    will-change: transform;
  }

  .dark .dark-invert { filter: invert(1) hue-rotate(180deg); }
  
  .dark .dark-card { background: var(--dark-card) !important; }
  .dark .dark-surface { background: var(--dark-surface) !important; }
  .dark .dark-text { color: #c8e6a0 !important; }
  .dark .dark-text-muted { color: #8aad60 !important; }
  .dark .dark-border { border-color: #2a3d1a !important; }

  .program-card:hover .program-icon {
    transform: scale(1.1) rotate(5deg);
    transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .program-icon {
    transition: transform 0.3s ease;
  }

  @keyframes borderGlow {
    0%, 100% { box-shadow: 0 0 0 0 rgba(111, 157, 54, 0.4); }
    50% { box-shadow: 0 0 0 8px rgba(111, 157, 54, 0); }
  }

  .testimonial-active {
    animation: scaleIn 0.5s ease forwards;
  }

  .progress-bar {
    height: 6px;
    border-radius: 3px;
    background: #e0e0e0;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    border-radius: 3px;
    background: linear-gradient(90deg, var(--forest), var(--leaf));
    transition: width 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  .tab-active {
    background: var(--forest);
    color: white;
    border-radius: 8px;
  }

  .gallery-item {
    overflow: hidden;
    border-radius: 16px;
    cursor: pointer;
  }

  .gallery-item img, .gallery-item .gallery-bg {
    transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  .gallery-item:hover img, .gallery-item:hover .gallery-bg {
    transform: scale(1.08);
  }

  .donation-card:hover {
    border-color: var(--forest) !important;
    box-shadow: 0 0 0 3px rgba(78, 125, 34, 0.15);
  }

  @media (max-width: 768px) {
    .hero-title { font-size: clamp(2.4rem, 8vw, 4rem) !important; }
  }
`;

// --- SVG Icons ---
const IconLeaf = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
  </svg>
);

const IconTree = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 22V13h3l-8-9-8 9h3v9h10z"/>
  </svg>
);

const IconHeart = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

const IconUsers = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const IconMapPin = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const IconCalendar = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const IconStar = ({ size = 20, color = "currentColor", filled = true }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : "none"} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const IconArrowRight = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);

const IconGlobe = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

const IconMoon = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

const IconSun = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/>
    <line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);

const IconMenu = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

const IconX = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const IconMail = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const IconPhone = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const IconPlay = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
    <polygon points="5 3 19 12 5 21 5 3"/>
  </svg>
);

const IconCheck = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const IconDroplets = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/>
    <path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"/>
  </svg>
);

const IconSeedling = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C6.48 2 2 6.48 2 12c0 1.74.44 3.37 1.21 4.79L12 22l8.79-5.21A9.96 9.96 0 0 0 22 12c0-5.52-4.48-10-10-10z"/>
    <path d="M12 2v20"/>
  </svg>
);

const IconBookOpen = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
);

const IconAward = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="6"/>
    <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
  </svg>
);

const IconCamera = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
);

const IconRecycle = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1.5 8.5 3.5 6.5 5.5 8.5"/>
    <path d="M3.5 6.5v3a2 2 0 0 0 2 2H10"/>
    <polyline points="22.5 15.5 20.5 17.5 18.5 15.5"/>
    <path d="M20.5 17.5v-3a2 2 0 0 0-2-2H14"/>
    <polyline points="8 1.5 10 3.5 8 5.5"/>
    <path d="M10 3.5H7a2 2 0 0 0-2 2v3.5"/>
    <polyline points="16 22.5 14 20.5 16 18.5"/>
    <path d="M14 20.5h3a2 2 0 0 0 2-2V15"/>
  </svg>
);

// --- Nature Forest SVG Scene ---
const ForestScene = () => (
  <svg viewBox="0 0 1440 400" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', zIndex: 1 }} preserveAspectRatio="none">
    {/* Sky gradient handled by parent */}
    {/* Far mountains */}
    <path d="M0,280 L120,180 L240,220 L360,160 L480,200 L600,140 L720,180 L840,150 L960,190 L1080,130 L1200,170 L1320,150 L1440,180 L1440,400 L0,400 Z" fill="#1a3d08" opacity="0.6"/>
    {/* Mid mountains */}
    <path d="M0,320 L80,240 L160,270 L280,210 L400,260 L520,220 L640,270 L760,230 L880,260 L1000,220 L1120,250 L1240,220 L1360,260 L1440,230 L1440,400 L0,400 Z" fill="#245c10" opacity="0.7"/>
    {/* Foreground trees */}
    <path d="M0,400 L0,300 L20,280 L40,300 L40,400 Z" fill="#1a4008"/>
    <path d="M0,320 L20,270 L40,320 Z" fill="#1f5010"/>
    <path d="M20,290 L35,250 L50,290 Z" fill="#1f5010"/>
    
    <path d="M100,400 L100,310 L120,285 L140,310 L140,400 Z" fill="#1a4008"/>
    <path d="M100,330 L120,275 L140,330 Z" fill="#245c12"/>
    <path d="M110,305 L125,265 L140,305 Z" fill="#2d6f18"/>
    
    <path d="M220,400 L220,320 L245,295 L270,320 L270,400 Z" fill="#1a4008"/>
    <path d="M215,340 L245,290 L275,340 Z" fill="#245c12"/>
    <path d="M220,315 L245,270 L270,315 Z" fill="#2d6f18"/>
    
    <path d="M1200,400 L1200,310 L1220,285 L1240,310 L1240,400 Z" fill="#1a4008"/>
    <path d="M1195,330 L1220,275 L1245,330 Z" fill="#245c12"/>
    <path d="M1200,308 L1220,268 L1240,308 Z" fill="#2d6f18"/>
    
    <path d="M1320,400 L1320,320 L1345,295 L1370,320 L1370,400 Z" fill="#1a4008"/>
    <path d="M1315,340 L1345,290 L1375,340 Z" fill="#245c12"/>
    <path d="M1320,318 L1345,274 L1370,318 Z" fill="#2d6f18"/>
    
    <path d="M1400,400 L1400,300 L1420,275 L1440,300 L1440,400 Z" fill="#1a4008"/>
    <path d="M1398,320 L1420,270 L1442,320 Z" fill="#245c12"/>
    
    {/* Foreground grass */}
    <path d="M0,380 Q360,360 720,375 Q1080,390 1440,370 L1440,400 L0,400 Z" fill="#1e4d0a"/>
  </svg>
);

// --- Floating Particles ---
const FloatingLeaves = () => {
  const leaves = ["🍃", "🌿", "🍀", "🌱"];
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 2 }}>
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="leaf-particle"
          style={{
            top: `${Math.random() * 80 + 5}%`,
            fontSize: `${Math.random() * 14 + 10}px`,
            animationDuration: `${Math.random() * 15 + 12}s`,
            animationDelay: `${Math.random() * 10}s`,
            opacity: 0.6,
          }}
        >
          {leaves[i % leaves.length]}
        </div>
      ))}
    </div>
  );
};

// --- Counter Hook ---
function useCounter(target, isVisible, duration = 2000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [isVisible, target, duration]);
  return count;
}

// --- useInView Hook ---
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

// --- Scroll Reveal Hook ---
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

// --- STAT COUNTER COMPONENT ---
function StatCounter({ target, suffix = "", prefix = "", label, icon, isVisible }) {
  const count = useCounter(target, isVisible);
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 4 }}>
        {icon}
        <span className="font-display" style={{ fontSize: '2.5rem', fontWeight: 700, color: COLORS.leafGreen, lineHeight: 1 }}>
          {prefix}{count.toLocaleString()}{suffix}
        </span>
      </div>
      <p style={{ fontSize: '0.9rem', fontWeight: 500, color: 'rgba(255,255,255,0.75)', marginTop: 4 }}>{label}</p>
    </div>
  );
}

// ==================== MAIN COMPONENT ====================
export default function KampuasAlam() {
  const [darkMode, setDarkMode] = useState(false);
  const [lang, setLang] = useState("ID");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("forest");
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [donationAmount, setDonationAmount] = useState(150000);
  const [galleryFilter, setGalleryFilter] = useState("all");
  const [statsRef, statsVisible] = useInView(0.3);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', program: 'volunteer', message: '' });
  const [submitted, setSubmitted] = useState(false);

  useScrollReveal();

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTestimonialIdx(i => (i + 1) % testimonials.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const t = (id, en, id_) => lang === "EN" ? en : id_;
  const bg = darkMode ? { background: '#0d1a07' } : { background: '#fff' };
  const textColor = darkMode ? '#e8f5d4' : COLORS.earthBrown;
  const cardBg = darkMode ? '#1a2a0e' : '#fff';
  const mutedText = darkMode ? '#8aad60' : '#7a6a5a';
  const borderColor = darkMode ? '#2a3d1a' : '#e8e6e2';

  // Data
  const programs = [
    { icon: <IconTree size={32} color={COLORS.forestGreen}/>, title: t('', 'Forest Conservation', 'Konservasi Hutan'), desc: t('', 'Hands-on reforestation and forest protection programs with community involvement', 'Program penghijauan dan perlindungan hutan dengan keterlibatan komunitas'), color: '#4E7D22' },
    { icon: <IconDroplets size={32} color={COLORS.natureBlue}/>, title: t('', 'Water Stewardship', 'Pengelolaan Air'), desc: t('', 'Watershed management, clean water access, and aquatic ecosystem protection', 'Pengelolaan DAS, akses air bersih, dan perlindungan ekosistem perairan'), color: '#2F6FC4' },
    { icon: <IconBookOpen size={32} color="#d4820e"/>, title: t('', 'Eco-Education', 'Pendidikan Lingkungan'), desc: t('', 'Environmental literacy programs for youth, schools, and community groups', 'Program literasi lingkungan untuk pemuda, sekolah, dan kelompok komunitas'), color: '#d4820e' },
    { icon: <IconSeedling size={32} color={COLORS.leafGreen}/>, title: t('', 'Organic Farming', 'Pertanian Organik'), desc: t('', 'Sustainable agriculture training empowering local farmers and food sovereignty', 'Pelatihan pertanian berkelanjutan memberdayakan petani lokal'), color: '#6F9D36' },
    { icon: <IconRecycle size={32} color="#9c3dba"/>, title: t('', 'Zero Waste', 'Zero Sampah'), desc: t('', 'Circular economy models and waste management education for communities', 'Model ekonomi sirkular dan edukasi pengelolaan sampah untuk komunitas'), color: '#9c3dba' },
    { icon: <IconAward size={32} color="#c0392b"/>, title: t('', 'Youth Leadership', 'Kepemimpinan Muda'), desc: t('', 'Developing next-generation environmental advocates and community leaders', 'Mengembangkan advokat lingkungan dan pemimpin komunitas generasi berikutnya'), color: '#c0392b' },
  ];

  const projects = [
    { title: t('', '10,000 Trees Initiative', 'Inisiatif 10.000 Pohon'), location: 'Tegal Sari, Jawa Tengah', year: '2024', impact: t('', '10,247 trees planted', '10.247 pohon ditanam'), tag: t('', 'Reforestation', 'Penghijauan'), tagColor: COLORS.forestGreen, bg: 'linear-gradient(135deg, #1a3d08, #2d6f18)' },
    { title: t('', 'Clean River Campaign', 'Kampanye Sungai Bersih'), location: 'Kali Kemiri & Kali Gung', year: '2024', impact: t('', '15 km river restored', '15 km sungai dipulihkan'), tag: t('', 'Water', 'Air'), tagColor: COLORS.natureBlue, bg: 'linear-gradient(135deg, #0e2d5c, #1a5499)' },
    { title: t('', 'Eco-School Network', 'Jaringan Sekolah Hijau'), location: '23 Schools, Tegal', year: '2023–24', impact: t('', '8,400 students reached', '8.400 siswa terjangkau'), tag: t('', 'Education', 'Pendidikan'), tagColor: '#d4820e', bg: 'linear-gradient(135deg, #3d1f08, #8a4a10)' },
    { title: t('', 'Organic Farmers Hub', 'Pusat Petani Organik'), location: 'Desa Tegal Sari', year: '2023', impact: t('', '340 farmers trained', '340 petani terlatih'), tag: t('', 'Agriculture', 'Pertanian'), tagColor: COLORS.leafGreen, bg: 'linear-gradient(135deg, #1a3a08, #3a6812)' },
  ];

  const testimonials = [
    { name: 'Siti Rahayu', role: t('', 'Community Leader, Tegal Sari', 'Ketua Komunitas, Tegal Sari'), stars: 5, quote: t('', 'Kampuas Alam has completely transformed our village. We now have clean water, thriving trees, and empowered youth. They are true agents of change.', 'Kampuas Alam telah mengubah desa kami sepenuhnya. Kini kami memiliki air bersih, pohon yang subur, dan pemuda yang berdaya. Mereka adalah agen perubahan sejati.'), avatar: '👩‍🌾' },
    { name: 'Ahmad Fauzi', role: t('', 'Local Farmer & Volunteer', 'Petani Lokal & Relawan'), stars: 5, quote: t('', 'The organic farming training changed my life. My harvest doubled and I earn a premium price for sustainable produce. This organization truly cares.', 'Pelatihan pertanian organik mengubah hidup saya. Hasil panen dua kali lipat dan harga premium untuk produk berkelanjutan. Organisasi ini benar-benar peduli.'), avatar: '👨‍🌾' },
    { name: 'Dr. Rina Kusumawati', role: t('', 'Environmental Scientist, UNDIP', 'Ilmuwan Lingkungan, UNDIP'), stars: 5, quote: t('', 'Their scientific approach to conservation combined with deep community engagement makes them stand out. A model for grassroots environmental action.', 'Pendekatan ilmiah mereka dalam konservasi dikombinasikan dengan keterlibatan komunitas yang mendalam membuat mereka menonjol. Model tindakan lingkungan akar rumput.'), avatar: '👩‍🔬' },
    { name: 'Bambang Sutrisno', role: t('', 'School Principal, SDN Tegal Sari', 'Kepala Sekolah, SDN Tegal Sari'), stars: 5, quote: t('', 'Our students are now proud environmental stewards. The eco-education program created a generation that truly loves and protects their natural heritage.', 'Siswa kami kini menjadi pelindung lingkungan yang bangga. Program ekologi menciptakan generasi yang benar-benar mencintai warisan alam mereka.'), avatar: '👨‍🏫' },
  ];

  const events = [
    { date: t('', 'July 15, 2026', '15 Juli 2026'), title: t('', 'Mangrove Planting Day', 'Hari Penanaman Mangrove'), loc: 'Pantai Tegal', type: t('', 'Conservation', 'Konservasi'), color: COLORS.forestGreen },
    { date: t('', 'August 3, 2026', '3 Agustus 2026'), title: t('', 'Eco-Youth Summit 2026', 'Summit Pemuda Hijau 2026'), loc: 'Gedung Serbaguna Tegal', type: t('', 'Leadership', 'Kepemimpinan'), color: '#d4820e' },
    { date: t('', 'August 22, 2026', '22 Agustus 2026'), title: t('', 'Clean River Marathon', 'Maraton Sungai Bersih'), loc: 'Sungai Kemiri – Gung', type: t('', 'Cleanup', 'Pembersihan'), color: COLORS.natureBlue },
    { date: t('', 'September 5, 2026', '5 September 2026'), title: t('', 'World Environment Day Gala', 'Gala Hari Lingkungan Dunia'), loc: 'Taman Kota Tegal', type: t('', 'Community', 'Komunitas'), color: COLORS.leafGreen },
  ];

  const galleryItems = [
    { cat: 'forest', label: t('', 'Forest Planting', 'Penanaman Hutan'), bg: 'linear-gradient(135deg, #1a3d08 0%, #4e7d22 50%, #2d6018 100%)', emoji: '🌳', span: '2', h: 280 },
    { cat: 'water', label: t('', 'River Clean-up', 'Bersih Sungai'), bg: 'linear-gradient(135deg, #0a2a5c 0%, #2f6fc4 60%, #1a4a8a 100%)', emoji: '💧', span: '1', h: 280 },
    { cat: 'community', label: t('', 'Community Event', 'Acara Komunitas'), bg: 'linear-gradient(135deg, #3d1f08 0%, #c4752f 60%, #8a4010 100%)', emoji: '🤝', span: '1', h: 200 },
    { cat: 'education', label: t('', 'Eco-Education', 'Ekologi-Edukasi'), bg: 'linear-gradient(135deg, #1a3d20 0%, #6f9d36 60%, #3a6018 100%)', emoji: '📚', span: '1', h: 200 },
    { cat: 'forest', label: t('', 'Seedling Nursery', 'Pembibitan'), bg: 'linear-gradient(135deg, #0d2a06 0%, #3a6a12 60%, #1a4008 100%)', emoji: '🌱', span: '1', h: 240 },
    { cat: 'community', label: t('', 'Volunteer Training', 'Pelatihan Relawan'), bg: 'linear-gradient(135deg, #2d1a3d 0%, #7c3dba 60%, #4a1a7a 100%)', emoji: '🎓', span: '2', h: 240 },
  ];

  const blogs = [
    { tag: t('', 'Conservation', 'Konservasi'), title: t('', 'How Local Forests Saved Our Village Water Supply', 'Bagaimana Hutan Lokal Menyelamatkan Pasokan Air Desa Kami'), date: t('', 'May 28, 2026', '28 Mei 2026'), read: '5 min', color: COLORS.forestGreen },
    { tag: t('', 'Community', 'Komunitas'), title: t('', 'Youth Eco-Leaders Shaping Tomorrow\'s Green Future', 'Pemimpin Eko-Muda Membentuk Masa Depan Hijau'), date: t('', 'May 15, 2026', '15 Mei 2026'), read: '4 min', color: '#d4820e' },
    { tag: t('', 'Science', 'Sains'), title: t('', 'Measuring Carbon Impact: Our 2025–26 Annual Report', 'Mengukur Dampak Karbon: Laporan Tahunan 2025–26'), date: t('', 'May 1, 2026', '1 Mei 2026'), read: '7 min', color: COLORS.natureBlue },
  ];

  const donationTiers = [
    { amount: 50000, label: t('', 'Seedling', 'Bibit'), impact: t('', 'Plants 2 trees', 'Tanam 2 pohon'), icon: '🌱' },
    { amount: 150000, label: t('', 'Sapling', 'Kecambah'), impact: t('', 'Funds 1 day of education', 'Mendanai 1 hari pendidikan'), icon: '🌿' },
    { amount: 500000, label: t('', 'Guardian', 'Penjaga'), impact: t('', 'Supports 5 volunteers', 'Mendukung 5 relawan'), icon: '🌳' },
    { amount: 1500000, label: t('', 'Champion', 'Juara'), impact: t('', 'Funds a full conservation program', 'Mendanai program konservasi penuh'), icon: '🏆' },
  ];

  const filteredGallery = galleryFilter === 'all' ? galleryItems : galleryItems.filter(g => g.cat === galleryFilter);

  return (
    <div style={{ ...bg, color: textColor, minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style dangerouslySetInnerHTML={{ __html: globalStyles }} />

      {/* ====== NAVIGATION ====== */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        padding: scrolled ? '12px 0' : '20px 0',
        transition: 'all 0.4s ease',
        background: scrolled
          ? (darkMode ? 'rgba(13,26,7,0.96)' : 'rgba(255,255,255,0.96)')
          : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? `1px solid ${darkMode ? '#1a3008' : '#e8e6e2'}` : 'none',
        boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.08)' : 'none',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: 'linear-gradient(135deg, #4E7D22, #6F9D36)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(78,125,34,0.35)',
            }}>
              <IconLeaf size={24} color="white"/>
            </div>
            <div>
              <div className="font-display" style={{ fontSize: '1.05rem', fontWeight: 700, lineHeight: 1.1, color: scrolled ? (darkMode ? '#c8e6a0' : COLORS.forestGreen) : 'white' }}>Kampuas Alam</div>
              <div style={{ fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.08em', color: scrolled ? (darkMode ? '#8aad60' : COLORS.leafGreen) : 'rgba(255,255,255,0.8)' }}>TEGAL SARI VOLUNTEERS</div>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            {[
              [t('','Programs','Program'), '#programs'],
              [t('','Projects','Proyek'), '#projects'],
              [t('','Events','Acara'), '#events'],
              [t('','Blog','Blog'), '#blog'],
              [t('','Contact','Kontak'), '#contact'],
            ].map(([label, href]) => (
              <a key={label} href={href} className="nav-link" style={{ color: scrolled ? (darkMode ? '#c8e6a0' : COLORS.earthBrown) : 'rgba(255,255,255,0.9)', textDecoration: 'none', fontSize: '0.9rem' }}>
                {label}
              </a>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Language */}
            <button onClick={() => setLang(l => l === 'ID' ? 'EN' : 'ID')} style={{
              background: 'transparent', border: `1px solid ${scrolled ? (darkMode ? '#3a5a1a' : '#d0ccc6') : 'rgba(255,255,255,0.4)'}`,
              borderRadius: 8, padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              color: scrolled ? (darkMode ? '#c8e6a0' : COLORS.earthBrown) : 'white', fontSize: '0.8rem', fontWeight: 600,
            }}>
              <IconGlobe size={14} color="currentColor"/>{lang}
            </button>
            {/* Dark Mode */}
            <button onClick={() => setDarkMode(d => !d)} style={{
              background: scrolled ? (darkMode ? '#1a3008' : '#f0eee9') : 'rgba(255,255,255,0.15)',
              border: 'none', borderRadius: 8, width: 36, height: 36, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: scrolled ? (darkMode ? '#c8e6a0' : COLORS.earthBrown) : 'white',
            }}>
              {darkMode ? <IconSun size={16}/> : <IconMoon size={16}/>}
            </button>
            {/* CTA */}
            <a href="#volunteer" className="btn-primary" style={{ fontSize: '0.85rem', padding: '10px 22px', textDecoration: 'none' }}>
              {t('','Join Us','Bergabung')} <IconArrowRight size={14}/>
            </a>
            {/* Mobile Menu */}
            <button onClick={() => setMobileOpen(o => !o)} style={{
              display: 'none', background: 'transparent', border: 'none', cursor: 'pointer',
              color: scrolled ? (darkMode ? '#c8e6a0' : COLORS.earthBrown) : 'white',
            }} className="mobile-menu-btn">
              {mobileOpen ? <IconX/> : <IconMenu/>}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div style={{ padding: '16px 32px', borderTop: `1px solid ${darkMode ? '#1a3008' : '#e8e6e2'}`, background: darkMode ? '#0d1a07' : '#fff' }}>
            {[t('','Programs','Program'), t('','Projects','Proyek'), t('','Events','Acara'), t('','Blog','Blog'), t('','Contact','Kontak')].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} style={{ display: 'block', padding: '12px 0', color: textColor, textDecoration: 'none', fontWeight: 500, borderBottom: `1px solid ${borderColor}` }} onClick={() => setMobileOpen(false)}>
                {item}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* ====== HERO SECTION ====== */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        {/* Hero Background */}
        <div className="hero-gradient" style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          {/* Radial glow */}
          <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: '60vw', height: '60vw', background: 'radial-gradient(ellipse, rgba(111,157,54,0.15) 0%, transparent 70%)', borderRadius: '50%', zIndex: 0 }}/>
          <div style={{ position: 'absolute', top: '10%', right: '10%', width: '300px', height: '300px', background: 'radial-gradient(ellipse, rgba(47,111,196,0.1) 0%, transparent 70%)', borderRadius: '50%', zIndex: 0 }}/>
        </div>

        {/* Stars */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
          {[...Array(60)].map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              width: Math.random() > 0.8 ? '3px' : '2px',
              height: Math.random() > 0.8 ? '3px' : '2px',
              background: 'rgba(255,255,255,0.6)',
              borderRadius: '50%',
              top: `${Math.random() * 60}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out ${Math.random() * 5}s infinite`,
            }}/>
          ))}
        </div>

        <FloatingLeaves/>
        <ForestScene/>

        {/* Hero Content */}
        <div style={{ position: 'relative', zIndex: 10, maxWidth: 1280, margin: '0 auto', padding: '120px 32px 80px', width: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
            {/* Left Text */}
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(111,157,54,0.15)', border: '1px solid rgba(111,157,54,0.3)', borderRadius: 50, padding: '8px 18px', marginBottom: 28 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS.leafGreen, display: 'inline-block', animation: 'pulse-ring 2s infinite', boxShadow: '0 0 0 0 rgba(111,157,54,0.4)' }}/>
                <span style={{ color: COLORS.leafGreen, fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.06em' }}>
                  {t('','EST. 2018 · TEGAL, JAVA ISLAND','EST. 2018 · TEGAL, PULAU JAWA')}
                </span>
              </div>

              <h1 className="font-display hero-title" style={{ fontSize: 'clamp(2.8rem, 5vw, 4.5rem)', fontWeight: 900, lineHeight: 1.05, color: 'white', marginBottom: 24, letterSpacing: '-0.02em' }}>
                {t('','Growing a','Menumbuhkan')}{' '}
                <span style={{ fontStyle: 'italic', background: 'linear-gradient(135deg, #6F9D36, #a8d840)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  {t('','Greener','Bumi yang')}{' '}
                </span>
                <br/>
                {t('','World, Together','Lebih Hijau')}
              </h1>

              <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.75)', marginBottom: 40, maxWidth: 480 }}>
                {t(
                  '',
                  'Kampuas Alam Tegal Sari Volunteers — uniting communities through environmental education, conservation action, and sustainable empowerment since 2018.',
                  'Kampuas Alam Tegal Sari Volunteers — menyatukan komunitas melalui pendidikan lingkungan, aksi konservasi, dan pemberdayaan berkelanjutan sejak 2018.'
                )}
              </p>

              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <a href="#volunteer" className="btn-primary" style={{ textDecoration: 'none', fontSize: '1rem', padding: '15px 36px' }}>
                  {t('','Become a Volunteer','Jadi Relawan')} <IconArrowRight size={18}/>
                </a>
                <a href="#programs" className="btn-outline-white" style={{ textDecoration: 'none', fontSize: '1rem', padding: '15px 36px' }}>
                  <IconPlay size={16} color="white"/> {t('','Our Programs','Program Kami')}
                </a>
              </div>

              {/* Scrolling Partners */}
              <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', letterSpacing: '0.12em', fontWeight: 600, marginBottom: 16 }}>
                  {t('','SUPPORTED BY','DIDUKUNG OLEH')}
                </p>
                <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
                  {['KLHK', 'UNDP', 'WWF-ID', 'Pertamina Foundation', 'BRIN'].map(p => (
                    <span key={p} style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{p}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Floating Cards */}
            <div style={{ position: 'relative', height: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* Blob shape */}
              <div className="animate-morph-blob" style={{
                position: 'absolute', width: 360, height: 360,
                background: 'linear-gradient(135deg, rgba(78,125,34,0.2), rgba(111,157,54,0.1))',
                border: '1px solid rgba(111,157,54,0.2)',
                zIndex: 0
              }}/>

              {/* Main impact card */}
              <div className="glass animate-float" style={{ borderRadius: 24, padding: 32, maxWidth: 280, textAlign: 'center', zIndex: 2 }}>
                <div style={{ fontSize: '3rem', marginBottom: 8 }}>🌍</div>
                <div className="font-display" style={{ fontSize: '2rem', fontWeight: 900, color: COLORS.leafGreen, lineHeight: 1 }}>10,247</div>
                <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', marginTop: 4 }}>{t('','Trees Planted This Year','Pohon Ditanam Tahun Ini')}</div>
                <div style={{ marginTop: 16, background: 'rgba(111,157,54,0.2)', borderRadius: 8, padding: '8px 16px' }}>
                  <span style={{ color: COLORS.leafGreen, fontSize: '0.8rem', fontWeight: 600 }}>↑ 34% {t('','from last year','dari tahun lalu')}</span>
                </div>
              </div>

              {/* Floating smaller cards */}
              <div className="glass animate-float-reverse" style={{ position: 'absolute', top: '8%', right: '-5%', borderRadius: 16, padding: '16px 20px', zIndex: 3, minWidth: 160 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: '1.5rem' }}>👥</span>
                  <div>
                    <div className="font-display" style={{ fontSize: '1.4rem', fontWeight: 700, color: 'white', lineHeight: 1 }}>2,340+</div>
                    <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.75rem' }}>{t('','Active Volunteers','Relawan Aktif')}</div>
                  </div>
                </div>
              </div>

              <div className="glass" style={{ position: 'absolute', bottom: '15%', left: '-5%', borderRadius: 16, padding: '14px 18px', zIndex: 3, animation: 'float 5s ease-in-out 1s infinite', minWidth: 150 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '1.3rem' }}>💧</span>
                  <div>
                    <div className="font-display" style={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.natureBlue, lineHeight: 1 }}>15 km</div>
                    <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.72rem' }}>{t('','Rivers Restored','Sungai Dipulihkan')}</div>
                  </div>
                </div>
              </div>

              <div className="glass" style={{ position: 'absolute', top: '55%', right: '-8%', borderRadius: 16, padding: '14px 18px', zIndex: 3, animation: 'floatReverse 6s ease-in-out 2s infinite', minWidth: 140 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '1.3rem' }}>🏫</span>
                  <div>
                    <div className="font-display" style={{ fontSize: '1.2rem', fontWeight: 700, color: '#d4820e', lineHeight: 1 }}>23</div>
                    <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.72rem' }}>{t('','Eco-Schools','Sekolah Hijau')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', zIndex: 10, textAlign: 'center' }}>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', letterSpacing: '0.1em', marginBottom: 8 }}>{t('','SCROLL','GULIR')}</div>
          <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)', margin: '0 auto', animation: 'float 2s ease-in-out infinite' }}/>
        </div>
      </section>

      {/* ====== STATS BAR ====== */}
      <div ref={statsRef} style={{ background: `linear-gradient(135deg, ${COLORS.forestGreen}, ${COLORS.leafGreen})`, padding: '60px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40 }}>
          <StatCounter target={10247} suffix="+" label={t('','Trees Planted','Pohon Ditanam')} icon={<span style={{fontSize:'1.8rem'}}>🌳</span>} isVisible={statsVisible}/>
          <StatCounter target={2340} suffix="+" label={t('','Volunteers','Relawan')} icon={<span style={{fontSize:'1.8rem'}}>👥</span>} isVisible={statsVisible}/>
          <StatCounter target={45} suffix="+" label={t('','Villages Reached','Desa Terjangkau')} icon={<span style={{fontSize:'1.8rem'}}>🏘️</span>} isVisible={statsVisible}/>
          <StatCounter target={8400} suffix="+" label={t('','Students Educated','Siswa Teredukasi')} icon={<span style={{fontSize:'1.8rem'}}>📚</span>} isVisible={statsVisible}/>
          <StatCounter target={6} suffix=" yrs" prefix="" label={t('','Years of Impact','Tahun Dampak')} icon={<span style={{fontSize:'1.8rem'}}>🏆</span>} isVisible={statsVisible}/>
        </div>
      </div>

      {/* ====== ABOUT / MISSION ====== */}
      <section style={{ padding: '100px 32px', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          {/* Visual */}
          <div className="reveal-left" style={{ position: 'relative' }}>
            <div style={{
              borderRadius: 32, overflow: 'hidden', height: 480,
              background: 'linear-gradient(160deg, #1a3d08 0%, #2d6f18 40%, #4e7d22 70%, #1e4010 100%)',
              position: 'relative',
            }}>
              {/* Inner nature art */}
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8rem' }}>🌿</div>
              <div style={{ position: 'absolute', top: '15%', right: '10%', fontSize: '3rem', animation: 'float 4s ease-in-out infinite' }}>🦋</div>
              <div style={{ position: 'absolute', bottom: '20%', left: '10%', fontSize: '3rem', animation: 'floatReverse 5s ease-in-out infinite' }}>🐦</div>
              <div style={{ position: 'absolute', top: '65%', right: '20%', fontSize: '2.5rem', animation: 'float 6s ease-in-out 1s infinite' }}>🌺</div>

              {/* Overlay info card */}
              <div className="glass" style={{ position: 'absolute', bottom: 24, left: 24, right: 24, borderRadius: 16, padding: '20px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: COLORS.forestGreen, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconAward size={24} color="white"/>
                  </div>
                  <div>
                    <div style={{ color: 'white', fontWeight: 700, fontSize: '0.95rem' }}>{t('','Nationally Recognized NGO','LSM yang Diakui Nasional')}</div>
                    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>{t('','KLHK Award 2024 · SDG Partner','KLHK Award 2024 · Mitra SDG')}</div>
                  </div>
                </div>
              </div>
            </div>
            {/* Decorative element */}
            <div style={{ position: 'absolute', top: -20, left: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(111,157,54,0.12)', border: '1px solid rgba(111,157,54,0.2)', zIndex: -1 }}/>
            <div className="animate-rotate-slow" style={{ position: 'absolute', bottom: -20, right: -20, width: 80, height: 80, borderRadius: '50%', border: '2px dashed rgba(78,125,34,0.3)', zIndex: -1 }}/>
          </div>

          {/* Text */}
          <div className="reveal-right">
            <div className="section-divider-left"/>
            <p style={{ color: COLORS.leafGreen, fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>
              {t('','Our Mission','Misi Kami')}
            </p>
            <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: 24, letterSpacing: '-0.02em' }}>
              {t('','Healing the Earth,','Menyembuhkan Bumi,')} {' '}
              <span className="text-gradient-warm">
                {t('','Empowering People','Memberdayakan Manusia')}
              </span>
            </h2>
            <p style={{ lineHeight: 1.9, color: mutedText, marginBottom: 20, fontSize: '1rem' }}>
              {t(
                '',
                'Founded in 2018 in Tegal Sari, Central Java, Kampuas Alam Tegal Sari Volunteers began as a grassroots movement of young nature lovers determined to restore their degraded local forests and empower their communities.',
                'Didirikan pada 2018 di Tegal Sari, Jawa Tengah, Kampuas Alam Tegal Sari Volunteers lahir sebagai gerakan akar rumput pemuda pecinta alam yang bertekad memulihkan hutan lokal dan memberdayakan komunitas mereka.'
              )}
            </p>
            <p style={{ lineHeight: 1.9, color: mutedText, marginBottom: 32, fontSize: '1rem' }}>
              {t(
                '',
                'Today, we are a nationally recognized environmental organization operating across 45+ villages, combining scientific rigor, indigenous wisdom, and community-centered approaches to create lasting ecological and social impact.',
                'Kini, kami adalah organisasi lingkungan yang diakui secara nasional beroperasi di 45+ desa, menggabungkan ketelitian ilmiah, kearifan lokal, dan pendekatan berbasis komunitas untuk menciptakan dampak ekologis dan sosial yang berkelanjutan.'
              )}
            </p>

            {/* Values */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 36 }}>
              {[
                { icon: '🌱', v: t('','Science-Based','Berbasis Sains') },
                { icon: '🤝', v: t('','Community-Led','Dipimpin Komunitas') },
                { icon: '♻️', v: t('','Sustainable Impact','Dampak Berkelanjutan') },
                { icon: '🌐', v: t('','Globally Connected','Terhubung Global') },
              ].map(item => (
                <div key={item.v} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.v}</span>
                </div>
              ))}
            </div>

            <a href="#contact" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex' }}>
              {t('','Learn Our Story','Pelajari Kisah Kami')} <IconArrowRight size={18}/>
            </a>
          </div>
        </div>
      </section>

      {/* ====== PROGRAMS ====== */}
      <section id="programs" style={{ background: darkMode ? '#141f0a' : '#f7f5f1', padding: '100px 32px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="section-divider"/>
            <p style={{ color: COLORS.leafGreen, fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>
              {t('','What We Do','Apa Yang Kami Lakukan')}
            </p>
            <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.02em' }}>
              {t('','Our Core Programs','Program Utama Kami')}
            </h2>
            <p style={{ color: mutedText, maxWidth: 560, margin: '16px auto 0', lineHeight: 1.8 }}>
              {t('','Six interconnected pillars driving measurable environmental and social transformation across Central Java.','Enam pilar yang saling terhubung mendorong transformasi lingkungan dan sosial yang terukur di seluruh Jawa Tengah.')}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {programs.map((p, i) => (
              <div key={i} className={`card-hover program-card reveal`} style={{ animationDelay: `${i * 0.1}s`, background: cardBg, borderRadius: 20, padding: 32, border: `1px solid ${borderColor}`, cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
                {/* Color accent */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${p.color}, ${p.color}aa)` }}/>
                <div className="program-icon" style={{ width: 64, height: 64, borderRadius: 16, background: `${p.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  {p.icon}
                </div>
                <h3 className="font-display" style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 12 }}>{p.title}</h3>
                <p style={{ color: mutedText, lineHeight: 1.7, fontSize: '0.9rem', marginBottom: 20 }}>{p.desc}</p>
                <a href="#contact" style={{ color: p.color, fontWeight: 600, fontSize: '0.85rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  {t('','Learn More','Pelajari Lebih')} <IconArrowRight size={14} color={p.color}/>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== PROJECTS ====== */}
      <section id="projects" style={{ padding: '100px 32px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="section-divider"/>
            <p style={{ color: COLORS.leafGreen, fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>
              {t('','Our Impact','Dampak Kami')}
            </p>
            <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.02em' }}>
              {t('','Featured Projects','Proyek Unggulan')}
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 28 }}>
            {projects.map((proj, i) => (
              <div key={i} className="card-hover reveal reveal-scale" style={{ borderRadius: 24, overflow: 'hidden', border: `1px solid ${borderColor}` }}>
                {/* Visual */}
                <div style={{ height: 200, background: proj.bg, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '4rem' }}>{['🌳','💧','🏫','🌾'][i]}</span>
                  <div style={{ position: 'absolute', top: 16, left: 16 }}>
                    <span style={{ background: proj.tagColor, color: 'white', padding: '4px 14px', borderRadius: 50, fontSize: '0.72rem', fontWeight: 700 }}>{proj.tag}</span>
                  </div>
                  <div style={{ position: 'absolute', top: 16, right: 16 }}>
                    <span style={{ background: 'rgba(0,0,0,0.3)', color: 'white', padding: '4px 12px', borderRadius: 50, fontSize: '0.72rem', fontWeight: 600 }}>{proj.year}</span>
                  </div>
                </div>
                {/* Content */}
                <div style={{ padding: '24px', background: cardBg }}>
                  <h3 className="font-display" style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 8 }}>{proj.title}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: mutedText, fontSize: '0.82rem', marginBottom: 16 }}>
                    <IconMapPin size={14} color={COLORS.leafGreen}/> {proj.location}
                  </div>
                  <div style={{ background: darkMode ? '#243a14' : '#f0f7e8', borderRadius: 8, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <IconCheck size={16} color={COLORS.forestGreen}/>
                    <span style={{ color: COLORS.forestGreen, fontWeight: 600, fontSize: '0.85rem' }}>{proj.impact}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="reveal" style={{ textAlign: 'center', marginTop: 48 }}>
            <a href="#contact" className="btn-secondary" style={{ textDecoration: 'none', display: 'inline-flex' }}>
              {t('','View All Projects','Lihat Semua Proyek')} <IconArrowRight size={18}/>
            </a>
          </div>
        </div>
      </section>

      {/* ====== IMPACT VISUAL ====== */}
      <section style={{ background: `linear-gradient(160deg, ${COLORS.earthBrown} 0%, #1a0d06 50%, #0d1a07 100%)`, padding: '80px 32px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-50%', right: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(78,125,34,0.1) 0%, transparent 70%)' }}/>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 64, alignItems: 'center' }}>
            <div className="reveal-left">
              <p style={{ color: COLORS.leafGreen, fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>{t('','Progress Report','Laporan Kemajuan')}</p>
              <h2 className="font-display" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 800, color: 'white', lineHeight: 1.2, marginBottom: 20 }}>
                {t('','Measurable Change,','Perubahan Terukur,')} <span style={{ color: COLORS.leafGreen }}>{t('','Real Results','Hasil Nyata')}</span>
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.8, fontSize: '0.95rem' }}>
                {t('','Our evidence-based approach ensures every action creates documented, lasting change for people and planet.','Pendekatan berbasis bukti kami memastikan setiap aksi menciptakan perubahan yang terdokumentasi dan berkelanjutan.')}
              </p>
            </div>
            <div className="reveal-right" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {[
                { label: t('','Forest Coverage Restored','Tutupan Hutan Dipulihkan'), pct: 78, color: COLORS.leafGreen },
                { label: t('','Water Quality Improved','Kualitas Air Meningkat'), pct: 91, color: COLORS.natureBlue },
                { label: t('','Youth Engaged','Pemuda Terlibat'), pct: 85, color: '#d4820e' },
                { label: t('','SDG Goals Aligned','Target SDG Tercapai'), pct: 94, color: '#9c3dba' },
              ].map((item, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', fontWeight: 500 }}>{item.label}</span>
                    <span style={{ color: item.color, fontWeight: 700, fontSize: '0.9rem' }}>{item.pct}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${item.pct}%`, background: `linear-gradient(90deg, ${item.color}88, ${item.color})` }}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ====== TESTIMONIALS ====== */}
      <section style={{ padding: '100px 32px', background: darkMode ? '#141f0a' : '#f7f5f1' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="section-divider"/>
            <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.02em' }}>
              {t('','Community Voices','Suara Komunitas')}
            </h2>
          </div>

          <div style={{ position: 'relative' }}>
            <div key={testimonialIdx} className="testimonial-active" style={{ background: cardBg, borderRadius: 28, padding: '48px', border: `1px solid ${borderColor}`, textAlign: 'center', position: 'relative' }}>
              {/* Quote mark */}
              <div className="font-display" style={{ fontSize: '6rem', lineHeight: 0.5, color: `${COLORS.leafGreen}30`, position: 'absolute', top: 32, left: 40, fontWeight: 900 }}>"</div>
              
              <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>{testimonials[testimonialIdx].avatar}</div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 20 }}>
                {[...Array(testimonials[testimonialIdx].stars)].map((_, i) => <IconStar key={i} size={18} color="#f59e0b"/>)}
              </div>
              <p className="font-display" style={{ fontSize: '1.2rem', fontStyle: 'italic', lineHeight: 1.8, color: textColor, marginBottom: 24, maxWidth: 680, margin: '0 auto 24px', position: 'relative', zIndex: 1 }}>
                "{testimonials[testimonialIdx].quote}"
              </p>
              <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 4 }}>{testimonials[testimonialIdx].name}</div>
              <div style={{ color: mutedText, fontSize: '0.85rem' }}>{testimonials[testimonialIdx].role}</div>
            </div>

            {/* Dots */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 28 }}>
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setTestimonialIdx(i)} style={{
                  width: i === testimonialIdx ? 28 : 10, height: 10, borderRadius: 5,
                  background: i === testimonialIdx ? COLORS.forestGreen : (darkMode ? '#2a3d1a' : '#d0ccc6'),
                  border: 'none', cursor: 'pointer', transition: 'all 0.3s',
                }}/>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ====== EVENTS ====== */}
      <section id="events" style={{ padding: '100px 32px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>
            <div className="reveal-left">
              <div className="section-divider-left"/>
              <p style={{ color: COLORS.leafGreen, fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>
                {t('','Upcoming','Mendatang')}
              </p>
              <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 2.6rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: 16, letterSpacing: '-0.02em' }}>
                {t('','Events & Activities','Acara & Kegiatan')}
              </h2>
              <p style={{ color: mutedText, lineHeight: 1.8, marginBottom: 32 }}>
                {t('','Join us in the field, classroom, and community. Every action counts towards a greener future.','Bergabunglah di lapangan, kelas, dan komunitas. Setiap tindakan berarti menuju masa depan yang lebih hijau.')}
              </p>
              <a href="#volunteer" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex' }}>
                {t('','Register for an Event','Daftar Acara')} <IconArrowRight size={18}/>
              </a>
            </div>

            <div className="reveal-right" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {events.map((ev, i) => (
                <div key={i} className="card-hover" style={{ background: cardBg, borderRadius: 18, padding: '20px 24px', border: `1px solid ${borderColor}`, display: 'flex', gap: 20, alignItems: 'center', cursor: 'pointer' }}>
                  <div style={{ minWidth: 56, height: 56, borderRadius: 14, background: `${ev.color}18`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <IconCalendar size={22} color={ev.color}/>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                      <span style={{ background: ev.color, color: 'white', padding: '2px 10px', borderRadius: 50, fontSize: '0.7rem', fontWeight: 700 }}>{ev.type}</span>
                      <span style={{ color: mutedText, fontSize: '0.78rem' }}>{ev.date}</span>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 4 }}>{ev.title}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: mutedText, fontSize: '0.8rem' }}>
                      <IconMapPin size={12} color={mutedText}/> {ev.loc}
                    </div>
                  </div>
                  <IconArrowRight size={18} color={ev.color}/>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ====== GALLERY ====== */}
      <section id="gallery" style={{ padding: '100px 32px', background: darkMode ? '#141f0a' : '#f7f5f1' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="section-divider"/>
            <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: 24 }}>
              {t('','Photo Gallery','Galeri Foto')}
            </h2>
            {/* Filter Tabs */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
              {[
                ['all', t('','All','Semua')],
                ['forest', t('','Forest','Hutan')],
                ['water', t('','Water','Air')],
                ['community', t('','Community','Komunitas')],
                ['education', t('','Education','Edukasi')],
              ].map(([val, lbl]) => (
                <button key={val} onClick={() => setGalleryFilter(val)} style={{
                  padding: '8px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
                  background: galleryFilter === val ? COLORS.forestGreen : (darkMode ? '#1a2a0e' : '#e8e6e2'),
                  color: galleryFilter === val ? 'white' : textColor,
                  transition: 'all 0.25s',
                }}>
                  {lbl}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {filteredGallery.slice(0, 6).map((item, i) => (
              <div key={i} className="gallery-item" style={{ gridColumn: item.span === '2' ? 'span 2' : 'span 1', height: item.h }}>
                <div className="gallery-bg" style={{ width: '100%', height: '100%', background: item.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: 16, position: 'relative' }}>
                  <span style={{ fontSize: '4rem', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}>{item.emoji}</span>
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)', padding: '24px 20px 16px', borderRadius: '0 0 16px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <IconCamera size={14} color="rgba(255,255,255,0.7)"/>
                      <span style={{ color: 'white', fontWeight: 600, fontSize: '0.85rem' }}>{item.label}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== VOLUNTEER REGISTRATION ====== */}
      <section id="volunteer" style={{ padding: '100px 32px', background: `linear-gradient(160deg, #f0f7e8 0%, #e8f5d4 100%)`, ...(darkMode && { background: 'linear-gradient(160deg, #1a2a0e 0%, #0d1a07 100%)' }) }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 64, alignItems: 'start' }}>
            <div className="reveal-left">
              <div className="section-divider-left"/>
              <p style={{ color: COLORS.leafGreen, fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>
                {t('','Join the Movement','Bergabung dengan Gerakan')}
              </p>
              <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 2.6rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: 20, letterSpacing: '-0.02em' }}>
                {t('','Become a Volunteer','Jadilah Relawan')}
              </h2>
              <p style={{ color: mutedText, lineHeight: 1.8, marginBottom: 32 }}>
                {t('','Your skills, passion, and time can make a real difference. Join thousands of volunteers creating meaningful environmental and social change.','Keterampilan, semangat, dan waktu Anda dapat membuat perbedaan nyata. Bergabunglah dengan ribuan relawan yang menciptakan perubahan lingkungan dan sosial yang berarti.')}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { icon: '🌿', t: t('','Field Conservation','Konservasi Lapangan'), d: t('','Planting, river cleanups, wildlife monitoring','Penanaman, bersih sungai, pemantauan satwa') },
                  { icon: '📚', t: t('','Education & Training','Pendidikan & Pelatihan'), d: t('','Teaching, workshops, curriculum development','Mengajar, workshop, pengembangan kurikulum') },
                  { icon: '💻', t: t('','Digital Advocacy','Advokasi Digital'), d: t('','Content creation, research, communications','Pembuatan konten, penelitian, komunikasi') },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '1.6rem', minWidth: 40 }}>{item.icon}</span>
                    <div>
                      <div style={{ fontWeight: 700, marginBottom: 4 }}>{item.t}</div>
                      <div style={{ color: mutedText, fontSize: '0.85rem' }}>{item.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Registration Form */}
            <div className="reveal-right">
              {submitted ? (
                <div style={{ background: cardBg, borderRadius: 28, padding: 48, border: `1px solid ${borderColor}`, textAlign: 'center' }}>
                  <div style={{ fontSize: '4rem', marginBottom: 16 }}>🎉</div>
                  <h3 className="font-display" style={{ fontSize: '1.8rem', fontWeight: 800, color: COLORS.forestGreen, marginBottom: 12 }}>
                    {t('','Welcome to the Team!','Selamat Bergabung!')}
                  </h3>
                  <p style={{ color: mutedText, lineHeight: 1.7 }}>
                    {t('','We\'ll contact you within 2 business days with next steps. Thank you for caring about our planet!','Kami akan menghubungi Anda dalam 2 hari kerja dengan langkah selanjutnya. Terima kasih telah peduli pada bumi kita!')}
                  </p>
                </div>
              ) : (
                <div style={{ background: cardBg, borderRadius: 28, padding: 40, border: `1px solid ${borderColor}`, boxShadow: '0 24px 64px rgba(78,125,34,0.08)' }}>
                  <h3 className="font-display" style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 28, color: COLORS.forestGreen }}>
                    {t('','Register Now','Daftar Sekarang')}
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    {[
                      { key: 'name', label: t('','Full Name','Nama Lengkap'), type: 'text', placeholder: t('','Your name','Nama Anda') },
                      { key: 'email', label: 'Email', type: 'email', placeholder: 'email@example.com' },
                    ].map(f => (
                      <div key={f.key}>
                        <label style={{ display: 'block', fontWeight: 600, fontSize: '0.82rem', marginBottom: 6, color: mutedText }}>{f.label}</label>
                        <input type={f.type} placeholder={f.placeholder} value={formData[f.key]} onChange={e => setFormData(d => ({...d, [f.key]: e.target.value}))}
                          style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: `1.5px solid ${borderColor}`, background: darkMode ? '#0d1a07' : '#fafaf8', color: textColor, fontSize: '0.9rem', outline: 'none', transition: 'border-color 0.2s' }}
                          onFocus={e => e.target.style.borderColor = COLORS.forestGreen}
                          onBlur={e => e.target.style.borderColor = borderColor}
                        />
                      </div>
                    ))}
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: '0.82rem', marginBottom: 6, color: mutedText }}>{t('','Phone Number','Nomor Telepon')}</label>
                    <input type="tel" placeholder="+62 xxx-xxxx-xxxx" value={formData.phone} onChange={e => setFormData(d => ({...d, phone: e.target.value}))}
                      style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: `1.5px solid ${borderColor}`, background: darkMode ? '#0d1a07' : '#fafaf8', color: textColor, fontSize: '0.9rem', outline: 'none' }}
                      onFocus={e => e.target.style.borderColor = COLORS.forestGreen}
                      onBlur={e => e.target.style.borderColor = borderColor}
                    />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: '0.82rem', marginBottom: 6, color: mutedText }}>{t('','Area of Interest','Bidang Minat')}</label>
                    <select value={formData.program} onChange={e => setFormData(d => ({...d, program: e.target.value}))}
                      style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: `1.5px solid ${borderColor}`, background: darkMode ? '#0d1a07' : '#fafaf8', color: textColor, fontSize: '0.9rem', outline: 'none' }}>
                      <option value="volunteer">{t('','Field Volunteer','Relawan Lapangan')}</option>
                      <option value="education">{t('','Education Program','Program Pendidikan')}</option>
                      <option value="digital">{t('','Digital Advocacy','Advokasi Digital')}</option>
                      <option value="research">{t('','Research','Penelitian')}</option>
                    </select>
                  </div>
                  <div style={{ marginBottom: 24 }}>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: '0.82rem', marginBottom: 6, color: mutedText }}>{t('','Message (Optional)','Pesan (Opsional)')}</label>
                    <textarea rows={3} placeholder={t('','Tell us about yourself...','Ceritakan tentang diri Anda...')} value={formData.message} onChange={e => setFormData(d => ({...d, message: e.target.value}))}
                      style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: `1.5px solid ${borderColor}`, background: darkMode ? '#0d1a07' : '#fafaf8', color: textColor, fontSize: '0.9rem', outline: 'none', resize: 'vertical' }}
                      onFocus={e => e.target.style.borderColor = COLORS.forestGreen}
                      onBlur={e => e.target.style.borderColor = borderColor}
                    />
                  </div>
                  <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '1rem', padding: '16px' }} onClick={() => setSubmitted(true)}>
                    {t('','Submit Application','Kirim Pendaftaran')} <IconArrowRight size={18}/>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ====== DONATION ====== */}
      <section id="donate" style={{ padding: '100px 32px', background: darkMode ? '#141f0a' : '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="section-divider"/>
            <p style={{ color: COLORS.leafGreen, fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>
              {t('','Support Our Work','Dukung Kami')}
            </p>
            <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.02em' }}>
              {t('','Fund the Future of Nature','Danai Masa Depan Alam')}
            </h2>
            <p style={{ color: mutedText, maxWidth: 520, margin: '16px auto 0', lineHeight: 1.8 }}>
              {t('','Every donation directly funds conservation, education, and community programs on the ground.','Setiap donasi langsung mendanai program konservasi, pendidikan, dan komunitas di lapangan.')}
            </p>
          </div>

          {/* Donation Tiers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 40 }}>
            {donationTiers.map((tier, i) => (
              <div key={i} className="donation-card card-hover" onClick={() => setDonationAmount(tier.amount)}
                style={{ borderRadius: 20, padding: '28px 24px', border: `2px solid ${donationAmount === tier.amount ? COLORS.forestGreen : borderColor}`, background: donationAmount === tier.amount ? (darkMode ? '#1a3008' : '#f0f7e8') : cardBg, cursor: 'pointer', textAlign: 'center', transition: 'all 0.3s', position: 'relative' }}>
                {i === 2 && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: COLORS.forestGreen, color: 'white', padding: '4px 16px', borderRadius: 50, fontSize: '0.72rem', fontWeight: 700, whiteSpace: 'nowrap' }}>{t('','Most Popular','Terpopuler')}</div>}
                <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>{tier.icon}</div>
                <div className="font-display" style={{ fontSize: '1.5rem', fontWeight: 800, color: COLORS.forestGreen, marginBottom: 4 }}>
                  Rp {tier.amount.toLocaleString('id-ID')}
                </div>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>{tier.label}</div>
                <div style={{ color: mutedText, fontSize: '0.82rem' }}>{tier.impact}</div>
              </div>
            ))}
          </div>

          {/* Custom Amount + CTA */}
          <div className="reveal" style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: mutedText, fontWeight: 600, fontSize: '0.9rem' }}>Rp</span>
                <input type="number" value={donationAmount} onChange={e => setDonationAmount(Number(e.target.value))}
                  style={{ width: '100%', padding: '14px 16px 14px 44px', borderRadius: 12, border: `1.5px solid ${borderColor}`, background: darkMode ? '#0d1a07' : '#f8f6f2', color: textColor, fontSize: '1rem', outline: 'none' }}
                  onFocus={e => e.target.style.borderColor = COLORS.forestGreen}
                  onBlur={e => e.target.style.borderColor = borderColor}
                />
              </div>
              <button className="btn-primary" style={{ whiteSpace: 'nowrap', padding: '14px 28px' }}>
                <IconHeart size={16}/> {t('','Donate','Donasi')}
              </button>
            </div>
            <p style={{ color: mutedText, fontSize: '0.8rem' }}>
              🔒 {t('','Secured by','Diamankan oleh')} SSL · {t('','Tax deductible','Dapat dikurangkan pajak')} · 100% {t('','transparent','transparan')}
            </p>
          </div>
        </div>
      </section>

      {/* ====== BLOG ====== */}
      <section id="blog" style={{ padding: '100px 32px', background: darkMode ? '#0d1a07' : '#f7f5f1' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div className="reveal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, flexWrap: 'wrap', gap: 20 }}>
            <div>
              <div className="section-divider-left"/>
              <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 2.6rem)', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.02em' }}>
                {t('','Stories & Insights','Kisah & Wawasan')}
              </h2>
            </div>
            <a href="#" className="btn-secondary" style={{ textDecoration: 'none', display: 'inline-flex' }}>
              {t('','All Articles','Semua Artikel')} <IconArrowRight size={18}/>
            </a>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 28 }}>
            {blogs.map((b, i) => (
              <div key={i} className="card-hover reveal" style={{ borderRadius: 20, overflow: 'hidden', border: `1px solid ${borderColor}`, background: cardBg }}>
                {/* Image Placeholder */}
                <div style={{ height: 180, background: `linear-gradient(135deg, ${b.color}22, ${b.color}55)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem', position: 'relative' }}>
                  {['🌿','👥','📊'][i]}
                  <div style={{ position: 'absolute', top: 16, left: 16 }}>
                    <span style={{ background: b.color, color: 'white', padding: '4px 14px', borderRadius: 50, fontSize: '0.72rem', fontWeight: 700 }}>{b.tag}</span>
                  </div>
                </div>
                <div style={{ padding: '24px' }}>
                  <h3 className="font-display" style={{ fontSize: '1.1rem', fontWeight: 700, lineHeight: 1.4, marginBottom: 16 }}>{b.title}</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: mutedText, fontSize: '0.8rem' }}>{b.date}</span>
                    <span style={{ color: b.color, fontSize: '0.8rem', fontWeight: 600 }}>{b.read} read</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== CONTACT ====== */}
      <section id="contact" style={{ padding: '100px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="section-divider"/>
            <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.02em' }}>
              {t('','Get in Touch','Hubungi Kami')}
            </h2>
            <p style={{ color: mutedText, maxWidth: 480, margin: '16px auto 0', lineHeight: 1.8 }}>
              {t('','Questions, partnerships, or media inquiries? We\'d love to hear from you.','Pertanyaan, kemitraan, atau media? Kami ingin mendengar dari Anda.')}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 48, alignItems: 'start' }}>
            {/* Contact Info */}
            <div className="reveal-left">
              {[
                { icon: <IconMapPin size={20} color={COLORS.forestGreen}/>, label: t('','Address','Alamat'), value: 'Jl. Tegal Sari No. 88, Tegal\nJawa Tengah, Indonesia 52100' },
                { icon: <IconPhone size={20} color={COLORS.forestGreen}/>, label: t('','Phone','Telepon'), value: '+62 283-xxx-xxxx' },
                { icon: <IconMail size={20} color={COLORS.forestGreen}/>, label: 'Email', value: 'info@kampuasalam.org' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 20, marginBottom: 32, alignItems: 'flex-start' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: `${COLORS.forestGreen}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: mutedText, marginBottom: 4 }}>{item.label}</div>
                    <div style={{ fontWeight: 500, fontSize: '0.95rem', whiteSpace: 'pre-line' }}>{item.value}</div>
                  </div>
                </div>
              ))}

              {/* Social Links */}
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {['Instagram', 'YouTube', 'Facebook', 'LinkedIn'].map(soc => (
                  <a key={soc} href="#" style={{ padding: '8px 18px', borderRadius: 8, background: darkMode ? '#1a2a0e' : '#f0eee9', color: textColor, textDecoration: 'none', fontWeight: 600, fontSize: '0.82rem', border: `1px solid ${borderColor}`, transition: 'all 0.2s' }}
                    onMouseOver={e => { e.target.style.background = COLORS.forestGreen; e.target.style.color = 'white'; e.target.style.borderColor = COLORS.forestGreen; }}
                    onMouseOut={e => { e.target.style.background = darkMode ? '#1a2a0e' : '#f0eee9'; e.target.style.color = textColor; e.target.style.borderColor = borderColor; }}>
                    {soc}
                  </a>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="reveal-right" style={{ background: cardBg, borderRadius: 24, padding: 36, border: `1px solid ${borderColor}` }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                {[t('','Name','Nama'), 'Email'].map(lbl => (
                  <div key={lbl}>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: '0.82rem', marginBottom: 6, color: mutedText }}>{lbl}</label>
                    <input type="text" placeholder={lbl} style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: `1.5px solid ${borderColor}`, background: darkMode ? '#0d1a07' : '#fafaf8', color: textColor, fontSize: '0.9rem', outline: 'none' }}
                      onFocus={e => e.target.style.borderColor = COLORS.forestGreen}
                      onBlur={e => e.target.style.borderColor = borderColor}
                    />
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.82rem', marginBottom: 6, color: mutedText }}>{t('','Subject','Subjek')}</label>
                <input type="text" placeholder={t('','How can we help?','Bagaimana kami bisa membantu?')} style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: `1.5px solid ${borderColor}`, background: darkMode ? '#0d1a07' : '#fafaf8', color: textColor, fontSize: '0.9rem', outline: 'none' }}
                  onFocus={e => e.target.style.borderColor = COLORS.forestGreen}
                  onBlur={e => e.target.style.borderColor = borderColor}
                />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.82rem', marginBottom: 6, color: mutedText }}>Message</label>
                <textarea rows={5} placeholder={t('','Your message...','Pesan Anda...')} style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: `1.5px solid ${borderColor}`, background: darkMode ? '#0d1a07' : '#fafaf8', color: textColor, fontSize: '0.9rem', outline: 'none', resize: 'vertical' }}
                  onFocus={e => e.target.style.borderColor = COLORS.forestGreen}
                  onBlur={e => e.target.style.borderColor = borderColor}
                />
              </div>
              <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '15px', fontSize: '1rem' }}>
                {t('','Send Message','Kirim Pesan')} <IconArrowRight size={18}/>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ====== NEWSLETTER CTA ====== */}
      <section style={{ background: `linear-gradient(135deg, ${COLORS.forestGreen} 0%, #3a6010 50%, #1a3d08 100%)`, padding: '72px 32px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-30%', right: '5%', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}/>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>🌱</div>
          <h2 className="font-display" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 800, color: 'white', marginBottom: 16, lineHeight: 1.2 }}>
            {t('','Stay Connected with Nature','Tetap Terhubung dengan Alam')}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, marginBottom: 36, fontSize: '1rem' }}>
            {t('','Get monthly updates on our conservation impact, volunteer opportunities, and environmental education resources.','Dapatkan pembaruan bulanan tentang dampak konservasi kami, peluang relawan, dan sumber daya pendidikan lingkungan.')}
          </p>
          <div style={{ display: 'flex', gap: 12, maxWidth: 440, margin: '0 auto', flexWrap: 'wrap', justifyContent: 'center' }}>
            <input type="email" placeholder={t('','Your email address','Alamat email Anda')} style={{ flex: 1, minWidth: 220, padding: '14px 20px', borderRadius: 50, border: 'none', background: 'rgba(255,255,255,0.15)', color: 'white', fontSize: '0.95rem', outline: 'none', backdropFilter: 'blur(10px)' }}/>
            <button style={{ background: 'white', color: COLORS.forestGreen, padding: '14px 28px', borderRadius: 50, border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem', whiteSpace: 'nowrap', transition: 'all 0.3s' }}
              onMouseOver={e => { e.target.style.transform = 'scale(1.04)'; e.target.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)'; }}
              onMouseOut={e => { e.target.style.transform = 'scale(1)'; e.target.style.boxShadow = 'none'; }}>
              {t('','Subscribe','Berlangganan')} →
            </button>
          </div>
        </div>
      </section>

      {/* ====== FOOTER ====== */}
      <footer style={{ background: darkMode ? '#060f03' : COLORS.earthBrown, color: 'rgba(255,255,255,0.75)', padding: '64px 32px 32px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 48 }}>
            {/* Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #4E7D22, #6F9D36)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IconLeaf size={24} color="white"/>
                </div>
                <div>
                  <div className="font-display" style={{ fontSize: '1.05rem', fontWeight: 700, color: 'white', lineHeight: 1.1 }}>Kampuas Alam</div>
                  <div style={{ fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.08em', color: COLORS.leafGreen }}>TEGAL SARI VOLUNTEERS</div>
                </div>
              </div>
              <p style={{ lineHeight: 1.8, fontSize: '0.88rem', maxWidth: 300, marginBottom: 24 }}>
                {t('','Uniting communities through environmental education, conservation action, and sustainable development since 2018.','Menyatukan komunitas melalui pendidikan lingkungan, aksi konservasi, dan pembangunan berkelanjutan sejak 2018.')}
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                {['🌿', '💧', '🌍', '🤝'].map((e, i) => (
                  <span key={i} style={{ fontSize: '1.2rem' }}>{e}</span>
                ))}
              </div>
            </div>

            {/* Links */}
            {[
              {
                title: t('','Programs','Program'),
                links: [t('','Forest Conservation','Konservasi Hutan'), t('','Water Stewardship','Pengelolaan Air'), t('','Eco-Education','Ekologi-Edukasi'), t('','Organic Farming','Pertanian Organik'), t('','Zero Waste','Zero Sampah')]
              },
              {
                title: t('','Get Involved','Terlibat'),
                links: [t('','Volunteer','Relawan'), t('','Donate','Donasi'), t('','Events','Acara'), t('','Partner','Mitra'), t('','Internship','Magang')]
              },
              {
                title: t('','Organization','Organisasi'),
                links: [t('','About Us','Tentang Kami'), t('','Our Team','Tim Kami'), t('','Annual Report','Laporan Tahunan'), t('','Media Kit','Kit Media'), t('','Contact','Kontak')]
              },
            ].map((col, i) => (
              <div key={i}>
                <div style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem', marginBottom: 20, letterSpacing: '0.02em' }}>{col.title}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {col.links.map(link => (
                    <a key={link} href="#" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s' }}
                      onMouseOver={e => e.target.style.color = COLORS.leafGreen}
                      onMouseOut={e => e.target.style.color = 'rgba(255,255,255,0.6)'}>
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)' }}>
              © 2026 Kampuas Alam Tegal Sari Volunteers · {t('','All rights reserved','Semua hak dilindungi')}
            </p>
            <div style={{ display: 'flex', gap: 24 }}>
              {[t('','Privacy Policy','Kebijakan Privasi'), t('','Terms of Use','Ketentuan Penggunaan'), 'Sitemap'].map(item => (
                <a key={item} href="#" style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'none', fontSize: '0.8rem', transition: 'color 0.2s' }}
                  onMouseOver={e => e.target.style.color = 'rgba(255,255,255,0.8)'}
                  onMouseOut={e => e.target.style.color = 'rgba(255,255,255,0.45)'}>
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 1024px) {
          .nav-desktop { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (max-width: 768px) {
          section > div, section { padding-left: 20px !important; padding-right: 20px !important; }
        }
      `}</style>
    </div>
  );
}
