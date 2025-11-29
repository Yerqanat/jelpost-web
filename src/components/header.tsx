"use client";

import { Toggle } from "./ui/toggle";
import { Menu, MoonIcon, Search, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "../i18n/navigation";

import Language from "../components/language";
import SearchShipment from "../components/Search";
import clsx from "clsx";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/src/components/ui/drawer";
import { Button } from "@/src/components/ui/button";
import { Switch } from "@/src/components/ui/switch";
import { Label } from "@/src/components/ui/label";
import { supabase } from "@/src/lib/supabaseClient";

import { User } from "@supabase/supabase-js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const router = useRouter();

  const isDark = theme === "dark";
  const t = useTranslations("header");
  const tAuth = useTranslations("auth");

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

  useEffect(() => {
    const fetchProfile = async (userId: string) => {
      const { data, error } = await supabase
        .from("profiles")
        .select("profile_picture")
        .eq("id", userId)
        .single();

      if (data && data.profile_picture) {
        setProfilePic(data.profile_picture);
      }
    };

    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
    });

    // Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfilePic(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <header
      className={clsx(
        "sticky top-0 z-50 bg-background/80 backdrop-blur-md transition-shadow",
        isScrollingDown && "shadow-[0_2px_10px_-2px_rgba(0,0,0,0.1)]"
      )}
    >
      <div className="px-2 md:px-0 max-w-5xl h-16 mx-auto flex items-center gap-2 md:gap-8">
        <Link className="mr-auto md:mr-0" href="/">
          <Image
            src="/jelpost-logo.svg"
            alt="Jelpost logo"
            width={120}
            height={30}
            priority
            preload={false}
          />
        </Link>
        <nav className="md:flex justify-between items-center mr-auto hidden">
          <ul className="flex gap-6 font-lato font-semibold">
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

        {/* Search bar */}
        <div>
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
        </div>

        <div className="hidden md:flex gap-4 py-4 h-full items-center">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage
                    src={profilePic || "/avatar.png"}
                    alt="User Avatar"
                  />
                  <AvatarFallback>
                    {user.phone?.slice(-2) || "U"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{tAuth("account")}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  {tAuth("logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Avatar
              className="cursor-pointer"
              onClick={() => router.push("/sign-in")}
            >
              <AvatarImage src="/avatar-anonymous.png" alt="Anonymous Avatar" />
              {/* Assuming avatar-anonymous.png exists or using default fallback */}
              <AvatarFallback>?</AvatarFallback>
            </Avatar>
          )}
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
        {/* Mobile menu button  */}
        <div className="md:hidden">
          <Drawer>
            <DrawerTrigger className="border p-1 rounded-md cursor-pointer">
              <Menu />
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader className="flex flex-col gap-4">
                <DrawerTitle></DrawerTitle>

                <ul className="flex flex-col gap-2 font-lato font-semibold">
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
                        isActive("/tracking")
                          ? "border-b-2 border-primary pb-1"
                          : ""
                      }
                    >
                      {t("track-code")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/tariffs"
                      className={
                        isActive("/tariffs")
                          ? "border-b-2 border-primary pb-1"
                          : ""
                      }
                    >
                      {t("tariffs")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/partner"
                      className={
                        isActive("/partner")
                          ? "border-b-2 border-primary pb-1"
                          : ""
                      }
                    >
                      {t("partners")}
                    </Link>
                  </li>
                </ul>
                <Separator />
                <div className="flex items-center justify-center space-x-2">
                  <Label htmlFor="theme-mode">{t("theme")}</Label>
                  <Switch
                    id="theme-mode"
                    checked={isDark}
                    onCheckedChange={(checked) =>
                      setTheme(checked ? "dark" : "light")
                    }
                  />
                </div>
                <div className="flex justify-center">
                  <Language />
                </div>
              </DrawerHeader>
              <DrawerFooter>
                {user ? (
                  <Button
                    variant="outline"
                    className="cursor-pointer"
                    onClick={handleSignOut}
                  >
                    {tAuth("logout")}
                  </Button>
                ) : (
                  <Link href="/sign-in" className="w-full">
                    <Button variant="outline" className="cursor-pointer w-full">
                      {t("sign-in")}
                    </Button>
                  </Link>
                )}
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </header>
  );
}
