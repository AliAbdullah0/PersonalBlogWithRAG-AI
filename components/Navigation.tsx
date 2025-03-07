"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import ChatBot from "./ChatBot";
import Image from "next/image";
import { motion } from "framer-motion";

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const linkVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: (i:number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: i * 0.1,
        ease: "easeOut",
      },
    }),
    hover: {
      scale: 1.05,
      color: "#4f46e5",
      transition: { duration: 0.2 },
    },
  };

  return (
    <header className="w-full fixed top-0 left-0 z-50 px-4 sm:px-6 lg:px-8">
      <motion.nav
        className={`flex items-center justify-between p-2 bg-background/50 backdrop-blur-lg rounded-full shadow-lg max-w-5xl w-full mx-auto mt-4 transition-all duration-300 ${
          isScrolled ? "py-1" : "py-2"
        }`}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex-shrink-0">
          <Image 
            src="/logo.png" 
            height={40} 
            width={40} 
            alt="Blog AI" 
            className="w-8 h-8 sm:w-10 sm:h-10"
          />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center justify-between flex-1 px-6">
          <ul className="flex items-center gap-8">
            {["Home", "Blog", "About"].map((item, index) => (
              <motion.li
                key={item}
                variants={linkVariants}
                initial="hidden"
                animate="visible"
                custom={index}
                whileHover="hover"
              >
                <Link
                  href={item === "Home" ? "/" : item === "Blog" ? "#blogs" : "/about"}
                  className="text-foreground font-semibold text-sm lg:text-base hover:text-yellow-600 transition-colors duration-300 relative group"
                >
                  {item}
                  <span className="absolute left-0 bottom-[-4px] w-0 h-[2px] bg-yellow-600 group-hover:w-full transition-all duration-300" />
                </Link>
              </motion.li>
            ))}
          </ul>

          <div className="flex items-center gap-4">
            <ChatBot />
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Button
                asChild
                variant="outline"
                className="border-yellow-500 text-black hover:bg-yellow-500 hover:text-white transition-all duration-300 rounded-full px-4 py-1 text-sm font-medium"
              >
                <Link href="/admin/login">Admin</Link>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center gap-2 sm:gap-3">
          <ChatBot />
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMobileMenu}
            className="text-foreground"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5 sm:h-6 sm:w-6" />
            ) : (
              <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
            )}
          </Button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          className="lg:hidden fixed inset-x-4 top-16 bg-background/95 backdrop-blur-lg border border-border rounded-lg shadow-lg mx-auto max-w-5xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <ul className="flex flex-col items-start gap-4 p-4 sm:p-6">
            {["Home", "Blogs", "About"].map((item, index) => (
              <motion.li
                key={item}
                variants={linkVariants}
                initial="hidden"
                animate="visible"
                custom={index}
                whileHover="hover"
                className="w-full"
              >
                <Link
                  href={item === "Home" ? "/" : item === "Blogs" ? "#blogs" : "/about"}
                  className="text-foreground font-semibold text-base hover:text-indigo-600 transition-colors duration-300 block py-2 w-full"
                  onClick={toggleMobileMenu}
                >
                  {item}
                </Link>
              </motion.li>
            ))}
            <motion.li
              variants={linkVariants}
              initial="hidden"
              animate="visible"
              custom={3}
              className="w-full"
            >
              <Button
                asChild
                variant="outline"
                className="w-full border-yellow-500 text-black hover:bg-yellow-500 hover:text-white transition-all duration-300 rounded-full py-2 text-base font-medium"
              >
                <Link href="/admin/login" onClick={toggleMobileMenu}>
                  Admin
                </Link>
              </Button>
            </motion.li>
          </ul>
        </motion.div>
      )}
    </header>
  );
};

export default Navigation;