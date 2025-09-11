"use client";

import React from "react";
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

export const RouteSelect = () => {
  const pathname = usePathname(); // Get the current route
  const router = useRouter();

  // Map titles to route paths
  const routes = [
    { title: "User Management", path: "/admin/usermanagement", Icon: FiUsers },
    {
      title: "AI Conversations",
      path: "/admin/conversations",
      Icon: FiMessageSquare,
    },
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

  const handleLogout = async () => {
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
  };

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
        onClick={handleLogout}
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
