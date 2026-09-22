"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
if (!supabase) {
  alert("Authentication is not configured.");
  return;
}

const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
});
  if (error) {
    alert(error.message);
    return;
  }

  router.push("/dashboard");
};

  const handleDemoLogin = () => {
    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen bg-[#f5faf9] flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 bg-white rounded-3xl shadow-xl overflow-hidden">

        {/* LEFT SIDE */}
        <div className="hidden lg:flex bg-[#035657] text-white p-12 flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-12">
              <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center text-xl">
                ♥
              </div>

              <div>
                <h1 className="text-xl font-bold">
                  SwasthySathi-AI
                </h1>

                <p className="text-xs text-white/70">
                  Personal Health Companion
                </p>
              </div>
            </div>

            <h2 className="text-4xl font-bold leading-tight mb-6">
              Your health.
              <br />
              Your environment.
              <br />
              <span className="text-teal-200">
                One intelligent companion.
              </span>
            </h2>

            <p className="text-white/75 text-base leading-7 max-w-md">
              Monitor environmental conditions, understand your
              personalized health risk, and receive early warnings
              before a situation becomes an emergency.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-white/10 rounded-2xl p-4">
              <span className="text-2xl">🌡️</span>
              <div>
                <p className="font-semibold">Environmental Monitoring</p>
                <p className="text-sm text-white/60">
                  Weather, temperature & AQI
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white/10 rounded-2xl p-4">
              <span className="text-2xl">❤️</span>
              <div>
                <p className="font-semibold">Personalized Risk</p>
                <p className="text-sm text-white/60">
                  Risk based on your profile
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white/10 rounded-2xl p-4">
              <span className="text-2xl">🛡️</span>
              <div>
                <p className="font-semibold">Privacy First</p>
                <p className="text-sm text-white/60">
                  Local-first health intelligence
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">

          {/* Mobile Logo */}
          <div className="lg:hidden mb-8">
            <h1 className="text-2xl font-bold text-[#035657]">
              SwasthySathi-AI
            </h1>
            <p className="text-sm text-gray-500">
              Personal Health Companion
            </p>
          </div>

          <div className="max-w-md w-full mx-auto">

            <div className="mb-8">
              <p className="text-sm font-semibold text-[#035657] mb-2">
                WELCOME BACK
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Sign in to your account
              </h2>

              <p className="text-gray-500">
                Continue monitoring your personalized health insights.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">

              {/* EMAIL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200
                  focus:outline-none focus:ring-2 focus:ring-[#035657]/20
                  focus:border-[#035657] transition"
                />
              </div>

              {/* PASSWORD */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-sm text-[#035657] font-medium hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full px-4 py-3.5 pr-20 rounded-xl border border-gray-200
                    focus:outline-none focus:ring-2 focus:ring-[#035657]/20
                    focus:border-[#035657] transition"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2
                    text-sm text-gray-500 hover:text-[#035657]"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* REMEMBER ME */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 accent-[#035657]"
                />

                <label
                  htmlFor="remember"
                  className="text-sm text-gray-600"
                >
                  Remember me
                </label>
              </div>

              {/* LOGIN */}
              <button
                type="submit"
                className="w-full bg-[#035657] text-white py-3.5 rounded-xl
                font-semibold hover:bg-[#024344] transition shadow-lg
                shadow-[#035657]/10"
              >
                Sign In
              </button>
            </form>

            {/* SIGN UP */}
            <div className="text-center mt-7">
              <p className="text-sm text-gray-500">
                Don't have an account?{" "}
                <button
                  onClick={() => router.push("/signup")}
                  className="text-[#035657] font-semibold hover:underline"
                >
                  Create account
                </button>
              </p>
            </div>

            {/* DIVIDER */}
            <div className="flex items-center gap-4 my-7">
              <div className="h-px bg-gray-200 flex-1" />
              <span className="text-xs text-gray-400">
                OR
              </span>
              <div className="h-px bg-gray-200 flex-1" />
            </div>

            {/* DEMO */}
            <button
              onClick={handleDemoLogin}
              className="w-full py-3.5 rounded-xl border-2 border-[#035657]
              text-[#035657] font-semibold hover:bg-[#035657]/5 transition"
            >
              Explore SIH Demo
            </button>

            <p className="text-center text-xs text-gray-400 mt-5">
              Demo mode • No medical records are stored
            </p>

          </div>
        </div>
      </div>
    </main>
  );
}