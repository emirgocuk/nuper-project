// src/components/Navbar.js
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Anasayfa', path: '/' },
    { name: 'Fırsatlar', path: '/opportunities' },
    { name: 'Bültenler', path: '/bulletins' },
    { name: 'Hakkımızda', path: '/about' }, // <-- BURADA DEĞİŞİKLİK: Metin 'Hakkımızda', yol '/about'
    { name: 'İletişim', path: '/contact' },
  ];

  return (
    <nav className="fixed w-full z-50 bg-white shadow-md py-4 transition-all duration-300">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-nuper-blue font-heading">
          Nuper
        </Link>

        {/* Desktop Menü */}
        <div className="hidden md:flex space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`text-lg font-semibold hover:text-nuper-blue transition-colors duration-300 font-sans ${
                location.pathname === item.path ? 'text-nuper-blue' : 'text-gray-700'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Mobil Menü Butonu */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-nuper-blue focus:outline-none">
            <FontAwesomeIcon icon={isOpen ? faTimes : faBars} size="lg" />
          </button>
        </div>
      </div>

      {/* Mobil Menü İçeriği */}
      <div
        className={`md:hidden bg-white w-full py-4 transition-all duration-300 ease-in-out ${
          isOpen ? 'block opacity-100' : 'hidden opacity-0'
        }`}
      >
        <div className="flex flex-col items-center space-y-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`text-lg font-semibold hover:text-nuper-blue transition-colors duration-300 font-sans ${
                location.pathname === item.path ? 'text-nuper-blue' : 'text-gray-700'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;