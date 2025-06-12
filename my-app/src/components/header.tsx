// components/Header.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// import '/workspaces/blog/my-app/src/index.css';

const Header: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header

        className={`fixed top-0 left-0 right-0 p-4 px-8 transition-all duration-300 ease-in-out z-50 ${
            isScrolled ? "bg-neutral-900 opacity-90 shadow-lg backdrop-blur-md" : "bg-transparent"
        } text-white`}
        >

        <div className="logo">
            <img src="/logo.png" alt="Logo" />
            {/* <span>LinkedRit</span> */}
        </div>

        <div className="max-w-screen-xl mx-auto flex items-center justify-between relative">
            {/* Centered Title */}
            <h1 className="text-2xl font-bold">
            <Link to="/" className="hover:text-gray-300">placeholder</Link>
            </h1>
            </div>

            {/* Right-aligned Nav */}
            <div className="nav"> 
            <nav>
               
            <ul className="flex space-x-6 text-lg font-medium">
                <li><Link to="/login" className="hover:text-gray-300">Auth</Link></li>
                <li><Link to="/signup" className="hover:text-gray-300">Signup</Link></li>
                <li><Link to="/blog" className="hover:text-gray-300">Blog</Link></li>
                <li><Link to ="/profile" className="hover:text-gray-300">Profile</Link></li>
                <li><Link to ="/contact" className="hover:text-gray-300">Contact</Link></li>
            </ul>
            </nav>
        </div>
        </header>

    );
};

export default Header;
