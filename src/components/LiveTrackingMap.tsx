import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "./ui/badge";
import { Truck, Package, Radio } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type Supply = Database["public"]["Tables"]["supplies"]["Row"];
type Transaction = Database["public"]["Tables"]["transactions"]["Row"];

interface SupplyLocation extends Supply {
  latest_transaction?: Transaction;
}

const LiveTrackingMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<Map<string, mapboxgl.Marker>>(new Map());
  const [supplies, setSupplies] = useState<SupplyLocation[]>([]);
  const [activeCount, setActiveCount] = useState(0);
  const { toast } = useToast();

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZS1kZXYiLCJhIjoiY20yN3pkZzg4MDB2ZzJrcjBnbXJreGZ4aCJ9.VWK6gYMEczo8hMK7_LsNgg';

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [78.9629, 20.5937], // Center of India
      zoom: 4,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    return () => {
      map.current?.remove();
    };
  }, []);

  // Fetch supplies in transit
  useEffect(() => {
    const fetchInTransitSupplies = async () => {
      const { data, error } = await supabase
        .from("supplies")
        .select("*")
        .eq("current_status", "in_transit");

      if (error) {
        console.error("Error fetching supplies:", error);
        return;
      }

      if (data) {
        // Fetch latest transaction with GPS for each supply
        const suppliesWithLocation = await Promise.all(
          data.map(async (supply) => {
            const { data: transactions } = await supabase
              .from("transactions")
              .select("*")
              .eq("supply_id", supply.id)
              .not("latitude", "is", null)
              .not("longitude", "is", null)
              .order("timestamp", { ascending: false })
              .limit(1);

            return {
              ...supply,
              latest_transaction: transactions?.[0],
            };
          })
        );

        setSupplies(suppliesWithLocation.filter(s => s.latest_transaction));
        setActiveCount(suppliesWithLocation.filter(s => s.latest_transaction).length);
      }
    };

    fetchInTransitSupplies();
  }, []);

  // Update markers when supplies change
  useEffect(() => {
    if (!map.current) return;

    // Remove old markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current.clear();

    // Add new markers
    supplies.forEach((supply) => {
      if (!supply.latest_transaction?.latitude || !supply.latest_transaction?.longitude) return;

      const el = document.createElement("div");
      el.className = "custom-marker";
      el.innerHTML = `
        <div class="relative">
          <div class="bg-blue-500 rounded-full p-3 shadow-lg animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2"/>
              <path d="m7.5 15 2.5-2.5L12.5 15 17 10.5"/>
            </svg>
          </div>
          <div class="absolute -top-1 -right-1 bg-green-500 rounded-full w-3 h-3 animate-ping"></div>
        </div>
      `;

      const marker = new mapboxgl.Marker(el)
        .setLngLat([
          Number(supply.latest_transaction.longitude),
          Number(supply.latest_transaction.latitude),
        ])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div class="p-2">
              <h3 class="font-bold text-sm">${supply.batch_id}</h3>
              <p class="text-xs text-gray-600">${supply.item_type}</p>
              <p class="text-xs mt-1"><strong>Quantity:</strong> ${supply.quantity}</p>
              <p class="text-xs"><strong>Location:</strong> ${supply.latest_transaction.from_location}</p>
              <p class="text-xs text-gray-500">${new Date(supply.latest_transaction.timestamp).toLocaleString()}</p>
            </div>
          `)
        )
        .addTo(map.current!);

      markersRef.current.set(supply.id, marker);
    });

    // Fit bounds to show all markers
    if (supplies.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      supplies.forEach((supply) => {
        if (supply.latest_transaction?.latitude && supply.latest_transaction?.longitude) {
          bounds.extend([
            Number(supply.latest_transaction.longitude),
            Number(supply.latest_transaction.latitude),
          ]);
        }
      });
      map.current?.fitBounds(bounds, { padding: 100 });
    }
  }, [supplies]);

  // Set up realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel("gps-updates")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "transactions",
          filter: "transaction_type=eq.GPS_UPDATE",
        },
        async (payload) => {
          console.log("GPS update received:", payload);
          
          const newTransaction = payload.new as Transaction;
          
          // Fetch the supply details
          const { data: supply } = await supabase
            .from("supplies")
            .select("*")
            .eq("id", newTransaction.supply_id)
            .single();

          if (supply) {
            setSupplies((prev) => {
              const existing = prev.find((s) => s.id === supply.id);
              if (existing) {
                // Update existing supply
                return prev.map((s) =>
                  s.id === supply.id
                    ? { ...s, latest_transaction: newTransaction }
                    : s
                );
              } else {
                // Add new supply
                return [...prev, { ...supply, latest_transaction: newTransaction }];
              }
            });

            toast({
              title: "Location Updated",
              description: `${supply.batch_id} moved to ${newTransaction.from_location}`,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Radio className="h-8 w-8 text-green-500 animate-pulse" />
              <div>
                <p className="text-sm text-muted-foreground">Live Tracking</p>
                <p className="font-semibold text-2xl">{activeCount}</p>
                <p className="text-xs text-muted-foreground">Active Shipments</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Truck className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">In Transit</p>
                <p className="font-semibold text-2xl">{supplies.length}</p>
                <p className="text-xs text-muted-foreground">Total Supplies</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Items</p>
                <p className="font-semibold text-2xl">
                  {supplies.reduce((acc, s) => acc + s.quantity, 0)}
                </p>
                <p className="text-xs text-muted-foreground">Units Tracked</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Radio className="h-5 w-5 text-green-500" />
              Live GPS Tracking
            </CardTitle>
            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              LIVE
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div
            ref={mapContainer}
            className="w-full h-[600px] rounded-lg border shadow-lg"
          />
        </CardContent>
      </Card>

      {supplies.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Active Shipments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {supplies.map((supply) => (
                <div
                  key={supply.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-semibold">{supply.batch_id}</p>
                    <p className="text-sm text-muted-foreground">{supply.item_type}</p>
                    {supply.latest_transaction && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Last update: {supply.latest_transaction.from_location} -{" "}
                        {new Date(supply.latest_transaction.timestamp).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                      In Transit
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-1">
                      {supply.quantity} units
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LiveTrackingMap;
