"use client";

import { Toggle } from "./ui/toggle";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { useTranslations } from "next-intl";
import { Link } from "../i18n/navigation";
import Language from "./language";

export default function Header() {
  const { theme, setTheme } = useTheme();

  const isDark = theme === "dark";
  const t = useTranslations("header");

  return (
    <header className="max-w-5xl h-16 mx-auto flex items-center gap-12">
      <Link href="/">
        <Image
          src="/tezpost-logo.svg"
          alt="Tezpost logo"
          width={120}
          height={30}
          priority
        />
      </Link>
      <nav className="flex justify-between items-center mr-auto">
        <ul className="flex gap-6 font-lato font-medium">
          <Link href="/tracking">{t("track-code")}</Link>
          <Link href="/tariffs">Tariffs</Link>
          <Link href="/partner">Partner</Link>
        </ul>
      </nav>
      <div className="flex gap-4 py-4 h-full items-center">
        <Avatar className="cursor-pointer" onClick={() => {}}>
          <AvatarImage src="/avatar.png" alt="Rabbit avatar" />
          <AvatarFallback>YY</AvatarFallback>
        </Avatar>
        <Separator orientation="vertical" />
        <Toggle
          aria-label="Toggle theme"
          variant="default"
          className="cursor-pointer border bg-transparent"
          pressed={isDark}
          onPressedChange={(pressed) => setTheme(pressed ? "dark" : "light")}
        >
          {isDark ? (
            <MoonIcon className="h-4 w-4" />
          ) : (
            <SunIcon className="h-4 w-4" />
          )}
        </Toggle>
        <Language />
      </div>
    </header>
  );
}
