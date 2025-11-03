import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function SearchShipment() {
  return (
    <div className="flex flex-1 border rounded-md">
      <Input className="border-0 shadow-none" />
      <Button
        variant="default"
        size="icon"
        className="rounded-l-none border border-primary border-l-0 cursor-pointer"
        aria-label="Submit"
      >
        <Search />
      </Button>
    </div>
  );
}
