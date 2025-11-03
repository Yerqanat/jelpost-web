"use client";

import { usePathname, useRouter } from "../i18n/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select";
import Image from "next/image";
import { languages } from "../constants/language";
import { useLocale } from "next-intl";

export default function Language() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const selectedLang =
    languages.find((l) => l.code === currentLocale) || languages[0];

  const handleLocaleChange = (locale: string) => {
    router.replace(pathname as string, { locale });
  };

  return (
    <Select defaultValue={currentLocale} onValueChange={handleLocaleChange}>
      <SelectTrigger className="cursor-pointer flex gap-2 items-center">
        <Image
          src={selectedLang.flag}
          alt={`${selectedLang.label} flag`}
          width={18}
          height={18}
          className="rounded-full"
        />
        <span>{selectedLang.code}</span>
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            <div className="flex items-center gap-2">
              <Image
                src={lang.flag}
                alt={`${lang.label} flag`}
                width={18}
                height={18}
                className="rounded-full"
              />
              <span>{lang.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
