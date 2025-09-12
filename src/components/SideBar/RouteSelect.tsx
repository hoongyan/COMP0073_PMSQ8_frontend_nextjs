"use client";

import React, { useState, useEffect } from "react";
import { IconType } from "react-icons";
import {
  FiMessageSquare,
  FiFileText,
  FiSearch,
  FiUsers,
  FiLogOut,
} from "react-icons/fi";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/lib/auth";
import { getCurrentUser } from "@/lib/auth";

export const RouteSelect = () => {
  const pathname = usePathname(); // Get the current route
  const router = useRouter();

  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        setRole(user.role);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to fetch user role");
        setIsLoading(false);
        router.push("/auth/sign-in");
      }
    };

    fetchUser();
  }, [router]);

  // Conditionally define routes based on role
  const routes = [
    // Only add admin routes if role is 'ADMIN'
    ...(role === "ADMIN"
      ? [
          {
            title: "User Management",
            path: "/admin/usermanagement",
            Icon: FiUsers,
          },
          {
            title: "AI Conversations",
            path: "/admin/conversations",
            Icon: FiMessageSquare,
          },
        ]
      : []),
    // Always show non-admin routes
    {
      title: "Scam Reports",
      path: "/reports",
      Icon: FiFileText,
    },
    {
      title: "Persons of Interest Information",
      path: "/persons_info",
      Icon: FiSearch,
    },
  ];

  if (isLoading) {
    return <div>Loading sidebar...</div>; // You can style this or make it a spinner
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-1">
      {routes.map(({ title, path, Icon }) => (
        <Route
          key={title}
          Icon={Icon}
          title={title}
          selected={pathname === path}
          href={path}
        />
      ))}
      <button
        onClick={async () => {
          const confirmed = window.confirm("Are you sure you want to log out?");
          if (!confirmed) return;

          try {
            await logout();
            alert("Logged out successfully!");
            setTimeout(() => {
              router.push("/auth/sign-in");
            }, 1000);
          } catch (error) {
            console.error("Logout error:", error);
            alert("Failed to log out. Please try again.");
          }
        }}
        className="flex items-center justify-start gap-2 w-full rounded px-2 py-1.5 text-sm transition-[box-shadow,_background-color,_color] hover:bg-stone-200 bg-transparent text-stone-500 shadow-none"
      >
        <FiLogOut />
        <span>Logout</span>
      </button>
    </div>
  );
};

const Route = ({
  selected,
  Icon,
  title,
  href,
}: {
  selected: boolean;
  Icon: IconType;
  title: string;
  href: string;
}) => {
  return (
    <Link
      href={href}
      className={`flex items-center justify-start gap-2 w-full rounded px-2 py-1.5 text-sm transition-[box-shadow,_background-color,_color] ${
        selected
          ? "bg-white text-stone-950 shadow"
          : "hover:bg-stone-200 bg-transparent text-stone-500 shadow-none"
      }`}
    >
      <Icon className={selected ? "text-violet-500" : ""} />
      <span>{title}</span>
    </Link>
  );
};
