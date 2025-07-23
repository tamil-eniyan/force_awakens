import React, { useEffect, useState } from 'react';

const Header = () => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        background: '#000',
        color: '#fff',
        padding: '12px 24px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        transform: animate ? 'translateY(0)' : 'translateY(-100%)',
        opacity: animate ? 1 : 0,
        transition: 'all 0.6s ease-out',
        fontFamily: "'Audiowide', cursive, sans-serif", // 🧠 enforced here
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          fontSize: '28px', // 🎯 more visible font
          letterSpacing: '1.5px',
          fontFamily: "'Audiowide', cursive, sans-serif", // 🧠 enforced here too
        }}
      >
        <span style={{ marginRight: 8 }}>PDF</span>
        <img
          src="/assets/preloader.gif"
          alt="logo"
          style={{
            height: '28px',
            width: '28px',
            objectFit: 'contain',
            margin: '0 8px',
          }}
        />
        <span>Studio</span>
      </div>
    </div>
  );
};

export default Header;
