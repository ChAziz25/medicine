"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function login() {
  const router = useRouter();
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: any) => {
    api
      .post("/user/login", {
        email: user,
        password: password,
      })
      .then((response) => {
        console.log(response.data);
        router.push("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-card shadow-xl border border-border p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-primary">
            Medical Internship Platform
          </h1>

          <p className="mt-2 text-sm text-gray-500">Sign in to continue</p>
        </div>

        <form action={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium">Email</label>

            <input
              type="email"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder="example@email.com"
              className="
              w-full
              rounded-lg
              border
              border-border
              bg-input
              px-4
              py-3
              outline-none
              transition
              focus:border-primary
              focus:ring-2
              focus:ring-primary
            "
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Password</label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="
              w-full
              rounded-lg
              border
              border-border
              bg-input
              px-4
              py-3
              outline-none
              transition
              focus:border-primary
              focus:ring-2
              focus:ring-primary
            "
            />
          </div>

          <button
            type="submit"
            className="
            w-full
            rounded-lg
            bg-primary
            py-3
            font-semibold
            text-white
            transition
            hover:bg-primary-hover
            active:scale-[0.98]
            cursor-pointer
          "
          >
            Login
          </button>
        </form>
      </div>
    </main>
  );
}
