"use client";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const t = useTranslations("home");
  return (
    <div className="flex min-h-screen items-center justify-center font-lato bg-background">
      <main className="flex min-h-screen w-full max-w-5xl flex-col items-center bg-background gap-8">
        {/* hero section  */}
        <div className="flex items-center justify-between py-8 w-full">
          <div className="flex max-w-3xl flex-col items-center gap-10 text-center sm:items-start sm:text-left">
            <h1 className="text-4xl font-lobster font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
              {t("title")}
            </h1>
            <p className="font-lato text-black/70 dark:text-zinc-300">
              {t("content")}
            </p>
            <Link href="/products">
              <Button
                variant="default"
                className="shadow-lg border cursor-pointer font-bold text-lg"
              >
                {t("CTA")}
              </Button>
            </Link>
          </div>
          <div className="w-full h-full flex justify-center items-center">
            <div className="rounded-4xl shadow-[0_2px_10px_2px_rgba(0,0,0,0.1)]">
              <Image
                src="/hero-app.svg"
                alt="Tezpost app"
                width={200}
                height={500}
                className="object-contain"
              />
            </div>
          </div>
        </div>

        <div className="bg-primary w-full h-20"></div>
      </main>
    </div>
  );
}
