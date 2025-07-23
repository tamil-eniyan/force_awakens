// src/components/Preloader.jsx
import React, { useEffect, useState } from 'react';

const Preloader = ({ onDone }) => {
  const [animateOut, setAnimateOut] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setAnimateOut(true), 3000); // Trigger animation
    const timer2 = setTimeout(() => onDone(), 4000);            // Remove after 1s

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onDone]);

  return (
    <div
      style={{
        backgroundColor: '#000',
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      <img
        src="/assets/preloader.gif"
        alt="Loading..."
        style={{
          width: 450,
          height: 450,
          transition: 'transform 1s ease-in, opacity 1s ease-in',
          transform: animateOut ? 'translateY(-200%)' : 'translateY(0)',
          opacity: animateOut ? 0 : 1,
        }}
      />
    </div>
  );
};

export default Preloader;
