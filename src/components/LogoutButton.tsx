"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: "/" })}
      className="text-red-500/80 hover:text-red-400 text-[10px] tracking-[0.2em] uppercase transition-colors whitespace-nowrap flex items-center gap-2"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-red-500/50 animate-pulse"></span>
      [ Terminate Session ]
    </button>
  );
}