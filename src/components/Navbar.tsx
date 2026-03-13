"use client";

import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/clerk-react";
import {
  CalendarCheck,
  DumbbellIcon,
  HomeIcon,
  Menu,
  UserIcon,
  X,
  ZapIcon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { isSignedIn } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navLinks = isSignedIn ? [
    { href: "/", label: "Home", icon: <HomeIcon size={16} /> },
    { href: "/generate-program", label: "Generate", icon: <DumbbellIcon size={16} /> },
    { href: "/routine", label: "Routine", icon: <CalendarCheck size={16} /> },
    { href: "/profile", label: "Profile", icon: <UserIcon size={16} /> },
  ] : [];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-md border-b border-border py-3 px-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 relative z-50">
          <Image src="/logo.png" alt="Logo" width={36} height={36} className="p-0.5 bg-primary/10 rounded-full" />
          <span className="text-xl font-bold font-mono">
            Fit<span className="text-primary">max</span>.ai
          </span>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden md:flex items-center gap-5">
          {isSignedIn ? (
            <>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors"
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              ))}
              <Button
                asChild
                variant="outline"
                className="ml-2 border-primary/50 text-primary hover:text-white hover:bg-primary/10 rounded-md"
              >
                <Link href="/generate-program">Get Started</Link>
              </Button>
              <UserButton />
            </>
          ) : (
            <>
              <SignInButton>
                <Button
                  variant={"outline"}
                  className="border-primary/50 text-primary hover:text-white hover:bg-primary/10 rounded-md"
                >
                  Sign In
                </Button>
              </SignInButton>

              <SignUpButton>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md">
                  Sign Up
                </Button>
              </SignUpButton>
            </>
          )}
        </nav>

        {/* MOBILE MENU TOGGLE */}
        <div className="flex items-center gap-4 md:hidden relative z-50">
          {isSignedIn && <UserButton />}
          <button
            onClick={toggleMenu}
            className="p-2 text-foreground hover:text-primary transition-colors"
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* MOBILE NAVIGATION OVERLAY */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="absolute top-0 left-0 right-0 h-screen bg-background/95 backdrop-blur-xl z-40 flex flex-col p-8 pt-24 gap-6 border-b border-primary/20"
            >
              <div className="flex flex-col gap-4">
                {isSignedIn ? (
                  <>
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-4 text-xl font-medium p-4 border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all rounded-none relative overflow-hidden group"
                      >
                        <div className="text-primary group-hover:scale-110 transition-transform">
                          {link.icon}
                        </div>
                        <span>{link.label}</span>
                        <div className="absolute top-0 left-0 w-1 h-full bg-primary transform -translate-x-full group-hover:translate-x-0 transition-transform" />
                      </Link>
                    ))}
                    <Button
                      asChild
                      variant="outline"
                      className="w-full py-6 mt-4 border-primary/50 text-primary text-lg rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Link href="/generate-program">Get Started</Link>
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-col gap-4 mt-4">
                    <SignInButton>
                      <Button
                        variant={"outline"}
                        className="w-full py-6 border-primary/50 text-primary text-lg rounded-md"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Sign In
                      </Button>
                    </SignInButton>

                    <SignUpButton>
                      <Button
                        className="w-full py-6 bg-primary text-primary-foreground text-lg rounded-md"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Sign Up
                      </Button>
                    </SignUpButton>
                  </div>
                )}
              </div>

              {/* CYBERPUNK DECORATION IN MENU */}
              <div className="mt-auto flex justify-between items-center opacity-30">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-primary/50" />
                <div className="mx-4 text-[10px] font-mono tracking-widest uppercase">Encryption Active</div>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-primary/50" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Navbar;
