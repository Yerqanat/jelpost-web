"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Separator } from "@/src/components/ui/separator";
import {
  CheckCircle2,
  Circle,
  Package,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabaseClient";

interface Shipment {
  id: string;
  tracking_number: string;
  status: string;
  origin?: string;
  destination?: string;
  estimated_delivery?: string;
  warehouses: {
    address: {
      street: string;
      province: string;
      country: string;
    };
  };
  branches: {
    address: {
      street: string;
      province: string;
      country: string;
    };
  };
}

interface ShipmentEvent {
  id: string;
  status: string;
  updated_at: string;
  location: string;
  note: string;
}

export default function TrackingResult() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [events, setEvents] = useState<ShipmentEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!code) return;

    const fetchData = async () => {
      setLoading(true);
      setError("");
      setShipment(null);
      setEvents([]);

      try {
        // Fetch shipment details
        const { data: shipmentData, error: shipmentError } = await supabase
          .from("global_shipments")
          .select("*, warehouses(address), branches(address)")
          .eq("tracking_number", code)
          .single();

        setShipment(shipmentData);
        if (shipmentError) throw shipmentError;
        if (!shipmentData) throw new Error("Shipment not found");

        // Fetch history
        const { data: historyData, error: historyError } = await supabase
          .from("global_shipment_history")
          .select("*")
          .eq("shipment_id", shipmentData.id)
          .order("updated_at", { ascending: false });

        if (historyError) throw historyError;

        setEvents(historyData || []);
      } catch (err: any) {
        console.error("Error fetching tracking data:", err);
        setError(
          err.message ===
            "JSON object requested, multiple (or no) rows returned"
            ? "Shipment not found"
            : err.message || "Error fetching data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [code]);

  if (!code) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If error or no shipment, we might want to show nothing or the error state.
  if (error || !shipment) {
    return (
      <div className="w-full max-w-3xl mx-auto mt-8">
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-semibold text-destructive mb-2">
              Shipment Not Found
            </h3>
            <p className="text-muted-foreground">
              We couldn't find any shipment with tracking number:{" "}
              <span className="font-mono font-bold">{code}</span>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto mt-8 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Package className="h-6 w-6 text-primary" />
                {shipment.tracking_number}
              </CardTitle>
              <CardDescription className="mt-2">
                Status:{" "}
                <span className="font-semibold text-primary">
                  {shipment.status}
                </span>
              </CardDescription>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">
                Estimated Delivery
              </p>
              <p className="font-bold">
                {shipment.estimated_delivery
                  ? new Date(shipment.estimated_delivery).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">From</p>
              <p className="font-semibold">
                {shipment.warehouses.address.country +
                  ", " +
                  shipment.warehouses.address.province || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">To</p>
              <p className="font-semibold">
                {shipment.branches.address.country +
                  ", " +
                  shipment.branches.address.province || "N/A"}
              </p>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-linear-to-b before:from-transparent before:via-slate-300 before:to-transparent">
            {events.map((event, index) => (
              <div
                key={event.id}
                className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
              >
                {/* Icon */}
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                  {index === 0 ? (
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                  ) : (
                    <Circle className="w-6 h-6 text-slate-300" />
                  )}
                </div>

                {/* Content */}
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-slate-200 shadow-sm bg-white dark:bg-slate-950">
                  <div className="flex items-center justify-between space-x-2 mb-1">
                    <div className="font-bold text-slate-900 dark:text-slate-100">
                      {event.note || event.status}
                    </div>
                    <time className="font-caveat font-medium text-indigo-500">
                      {new Date(event.updated_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </time>
                  </div>

                  <div className="text-xs text-slate-400 mt-1">
                    {new Date(event.updated_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
