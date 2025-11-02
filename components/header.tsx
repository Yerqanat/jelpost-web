"use client";
import Link from "next/link";
import { Toggle } from "./ui/toggle";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

export default function Header() {
  const { theme, setTheme } = useTheme();

  const isDark = theme === "dark";
  return (
    <header>
      <nav className="max-w-5xl mx-auto flex justify-between items-center">
        <ul className="flex gap-4">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </ul>
        <Toggle
          aria-label="Toggle theme"
          variant="default"
          pressed={isDark}
          onPressedChange={(pressed) => setTheme(pressed ? "dark" : "light")}
        >
          {isDark ? (
            <MoonIcon className="h-4 w-4" />
          ) : (
            <SunIcon className="h-4 w-4" />
          )}
        </Toggle>
      </nav>
    </header>
  );
}
