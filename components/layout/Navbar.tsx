"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Menu,
  X,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Navbar = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Overview" },
    { href: "/dashboard", label: "Live Dashboard" },
    { href: "/profile", label: "Profile & Sensitivities" },
    { href: "/privacy", label: "Privacy Model" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-surface-container shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">

          {/* Logo & Product Identity */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
              <Activity className="w-5 h-5 text-primary-fixed" />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-headline font-bold text-lg text-primary leading-none tracking-tight">
                  SwasthyaSathi AI
                </span>

                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-primary-fixed text-primary font-semibold tracking-wider">
                  SIH26181
                </span>
              </div>

              <span className="text-xs text-on-surface-variant font-medium mt-0.5">
                Personal Health Companion
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3.5 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-surface-container text-primary font-semibold"
                      : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Status & Actions */}
          <div className="hidden lg:flex items-center gap-3">

            {/* Edge Engine Pill */}
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-surface-container border border-surface-container-high text-xs font-mono text-on-surface-variant">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>

              <span>Edge AI Engine: Ready</span>
            </div>

            {/* Login */}
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl border border-primary text-primary text-sm font-semibold hover:bg-primary hover:text-white transition-all"
            >
              Login
            </Link>

            {/* Create Account */}
            <Link
              href="/signup"
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-container transition-all shadow-sm active:scale-95"
            >
              Create Account
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-surface-container bg-white px-4 pt-3 pb-6 space-y-3">

          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "px-3 py-2.5 rounded-lg text-base font-medium transition-colors",
                    isActive
                      ? "bg-surface-container text-primary font-semibold"
                      : "text-on-surface-variant hover:bg-surface-container-low"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Mobile Authentication Buttons */}
          <div className="pt-3 border-t border-surface-container space-y-2">

            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center w-full px-4 py-2.5 rounded-xl border border-primary text-primary font-semibold text-sm hover:bg-primary hover:text-white transition-all"
            >
              Login
            </Link>

            <Link
              href="/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center w-full px-4 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm shadow-sm"
            >
              Create Account
            </Link>

            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-surface-container text-primary font-semibold text-sm"
            >
              <span>Launch Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

          </div>
        </div>
      )}
    </header>
  );
};

