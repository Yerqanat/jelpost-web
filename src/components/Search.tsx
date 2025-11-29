"use client";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function SearchShipment() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [code, setCode] = useState("");

  useEffect(() => {
    const codeParam = searchParams.get("code");
    if (codeParam) {
      setCode(codeParam);
    }
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      router.push(`/tracking?code=${encodeURIComponent(code.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex flex-1 border rounded-md">
      <Input
        className="border-0 shadow-none"
        placeholder="Enter tracking number"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <Button
        type="submit"
        variant="default"
        size="icon"
        className="rounded-l-none border border-primary border-l-0 cursor-pointer"
        aria-label="Submit"
      >
        <Search />
      </Button>
    </form>
  );
}
