"use client";

import api from "@/lib/axios";
import { useState } from "react";

function page() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    api
      .post("/user/TeacherRegister", {
        name: e.target.name.value,
        email: e.target.email.value,
        password: e.target.password.value,
      })
      .then((res) => {
        setSuccess(true);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-100 mb-2">
          Register Teacher
        </h1>
        <p className="text-gray-400 text-sm mb-6">
          Create a teacher account under your university
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Dr. Smith"
              required
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="teacher@university.edu"
              required
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              required
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-violet-600 hover:bg-violet-500 disabled:bg-violet-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors mt-2"
          >
            {loading ? "Creating..." : "Create Teacher Account"}
          </button>
        </form>

        {success && (
          <div className="mt-4 p-3 bg-violet-900/50 border border-violet-700 text-violet-300 rounded-lg text-sm">
            ✅ Teacher account created successfully!
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-900/50 border border-red-700 text-red-300 rounded-lg text-sm">
            ❌ {error}
          </div>
        )}
      </div>
    </div>
  );
}

export default page;
