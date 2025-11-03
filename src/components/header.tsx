"use client";

import { Toggle } from "./ui/toggle";
import { MoonIcon, Search, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "../i18n/navigation";

import Language from "./language";
import SearchShipment from "./Search";
import clsx from "clsx";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const pathname = usePathname();

  const isDark = theme === "dark";
  const t = useTranslations("header");

  const isActive = (href: string) => pathname.endsWith(href);

  useEffect(() => {
    let lastY = window.scrollY;

    const onScroll = () => {
      const currentY = window.scrollY;

      if (currentY > lastY) {
        // scrolling up
        setIsScrollingDown(true);
      } else {
        // scrolling down
        setIsScrollingDown(false);
      }

      lastY = currentY;
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={clsx(
        "sticky top-0 z-50 bg-background/80 backdrop-blur-md transition-shadow",
        isScrollingDown && "shadow-[0_2px_10px_-2px_rgba(0,0,0,0.1)]"
      )}
    >
      <div className="max-w-5xl min-w-3xl h-16 mx-auto flex items-center gap-8">
        <Link href="/">
          <Image
            src="/tezpost-logo.svg"
            alt="Tezpost logo"
            width={120}
            height={30}
            priority
            preload={false}
          />
        </Link>
        <nav className="flex justify-between items-center mr-auto">
          <ul className="flex gap-6 font-lato font-medium">
            <li>
              <Link
                href="/"
                className={
                  isActive("/") ? "border-b-2 border-primary pb-1" : ""
                }
              >
                {t("home")}
              </Link>
            </li>
            <li>
              <Link
                href="/tracking"
                className={
                  isActive("/tracking") ? "border-b-2 border-primary pb-1" : ""
                }
              >
                {t("track-code")}
              </Link>
            </li>
            <li>
              <Link
                href="/tariffs"
                className={
                  isActive("/tariffs") ? "border-b-2 border-primary pb-1" : ""
                }
              >
                {t("tariffs")}
              </Link>
            </li>
            <li>
              <Link
                href="/partner"
                className={
                  isActive("/partner") ? "border-b-2 border-primary pb-1" : ""
                }
              >
                {t("partners")}
              </Link>
            </li>
          </ul>
        </nav>
        <Dialog>
          <DialogTrigger className="bg-primary p-2 rounded-full cursor-pointer">
            <Search size={16} color="white" />
          </DialogTrigger>
          <DialogContent showCloseButton={false}>
            <DialogHeader>
              <DialogTitle>{t("search-code")}</DialogTitle>
              <SearchShipment />
            </DialogHeader>
          </DialogContent>
        </Dialog>

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
      </div>
    </header>
  );
}
