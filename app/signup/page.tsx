"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  Activity,
  Eye,
  EyeOff,
  ArrowLeft,
  UserPlus,
} from "lucide-react";

export default function SignupPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

 const handleSignup = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

  if (!name || !email || !password || !confirmPassword) {
    setError("Please fill in all fields.");
    return;
  }

  if (password.length < 6) {
    setError("Password must contain at least 6 characters.");
    return;
  }

  if (password !== confirmPassword) {
    setError("Passwords do not match.");
    return;
  }

  // Create user in Supabase Authentication
  const { data, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    setError(authError.message);
    return;
  }

  // Save profile in database
  const user = data.user;

  if (user) {
    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: user.id,
        full_name: name,
      });

    if (profileError) {
      setError(profileError.message);
      return;
    }
  }

  router.push("/profile");
};

  return (
    <main className="min-h-screen bg-surface flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Back to Home */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Signup Card */}
        <div className="bg-white rounded-2xl border border-surface-container shadow-lg p-6 sm:p-8">

          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-sm">
              <Activity className="w-7 h-7 text-white" />
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-7">
            <h1 className="font-headline text-2xl sm:text-3xl font-bold text-primary">
              Create Your Account
            </h1>

            <p className="mt-2 text-sm text-on-surface-variant">
              Start your personalized health journey with SwasthyaSathi AI.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSignup} className="space-y-5">

            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-2">
                Full Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full rounded-xl border border-surface-container-high px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-2">
                Email Address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-surface-container-high px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-2">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="w-full rounded-xl border border-surface-container-high px-4 py-3 pr-12 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-2">
                Confirm Password
              </label>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full rounded-xl border border-surface-container-high px-4 py-3 pr-12 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Create Account */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-container active:scale-[0.98]"
            >
              <UserPlus className="w-4 h-4" />
              Create Account
            </button>

          </form>

          {/* Login Link */}
          <div className="mt-6 text-center text-sm text-on-surface-variant">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary hover:underline"
            >
              Login
            </Link>
          </div>
        </div>

        {/* Privacy Message */}
        <p className="text-center text-xs text-on-surface-variant mt-5 px-4">
          Your health data stays private and is designed with a local-first
          approach.
        </p>

      </div>
    </main>
  );
}