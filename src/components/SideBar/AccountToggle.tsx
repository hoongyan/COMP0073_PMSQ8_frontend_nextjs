"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, UserRead } from "@/lib/auth";

export const AccountToggle = () => {
  const [user, setUser] = useState<UserRead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (err: any) {
        setError(err.message || "Failed to load user data");
        if (err.message.includes("Session expired")) {
          router.push("/auth/sign-in");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  if (loading) {
    return (
      <div className="border-b mb-4 mt-2 pb-4 border-stone-300">Loading...</div>
    );
  }

  if (error || !user) {
    return (
      <div className="border-b mb-4 mt-2 pb-4 border-stone-300">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="border-b mb-4 mt-2 pb-4 border-stone-300">
      <button className="flex p-0.5 hover:bg-stone-200 rounded transition-colors relative gap-2 w-full items-center">
        <img
          src="https://api.dicebear.com/9.x/notionists/svg"
          alt="avatar"
          className="size-8 rounded shrink-0 bg-violet-500 shadow"
        />
        <div className="text-start">
          <span className="text-sm font-bold block">
            {user.first_name} {user.last_name}
          </span>
          <span className="text-xs block text-stone-500">{user.role}</span>
        </div>
      </button>
    </div>
  );
};
