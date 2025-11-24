import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, MapPin, Route, Clock, Package } from "lucide-react";

interface RouteData {
  distance: string;
  duration: string;
  shippingTime: string;
  geometry: any;
}

interface LocationData {
  coordinates: [number, number];
  placeName: string;
}

const ShippingRouteMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [senderAddress, setSenderAddress] = useState("");
  const [receiverAddress, setReceiverAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [originData, setOriginData] = useState<LocationData | null>(null);
  const [destinationData, setDestinationData] = useState<LocationData | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map with a token (we'll use a public token just for display)
    // The actual API calls go through our edge function
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

  const calculateRoute = async () => {
    if (!senderAddress.trim() || !receiverAddress.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter both sender and receiver addresses",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setRouteData(null);

    try {
      // Step 1: Geocode addresses
      const { data: geocodeData, error: geocodeError } = await supabase.functions.invoke(
        "mapbox-route",
        {
          body: {
            action: "geocode",
            origin: senderAddress,
            destination: receiverAddress,
          },
        }
      );

      if (geocodeError) throw geocodeError;
      if (geocodeData.error) throw new Error(geocodeData.error);

      const { origin, destination } = geocodeData;
      setOriginData(origin);
      setDestinationData(destination);

      // Step 2: Calculate route
      const { data: routeResponse, error: routeError } = await supabase.functions.invoke(
        "mapbox-route",
        {
          body: {
            action: "route",
            originCoords: origin.coordinates,
            destinationCoords: destination.coordinates,
          },
        }
      );

      if (routeError) throw routeError;
      if (routeResponse.error) throw new Error(routeResponse.error);

      setRouteData(routeResponse);

      // Update map
      if (map.current) {
        // Clear existing markers and layers
        const markers = document.querySelectorAll(".mapboxgl-marker");
        markers.forEach((marker) => marker.remove());

        if (map.current.getSource("route")) {
          map.current.removeLayer("route");
          map.current.removeSource("route");
        }

        // Add origin marker
        new mapboxgl.Marker({ color: "#22c55e" })
          .setLngLat(origin.coordinates as [number, number])
          .setPopup(new mapboxgl.Popup().setHTML(`<strong>Sender</strong><br>${origin.placeName}`))
          .addTo(map.current);

        // Add destination marker
        new mapboxgl.Marker({ color: "#ef4444" })
          .setLngLat(destination.coordinates as [number, number])
          .setPopup(new mapboxgl.Popup().setHTML(`<strong>Receiver</strong><br>${destination.placeName}`))
          .addTo(map.current);

        // Add route line
        map.current.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: routeResponse.geometry,
          },
        });

        map.current.addLayer({
          id: "route",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#3b82f6",
            "line-width": 4,
          },
        });

        // Fit map to show entire route
        const bounds = new mapboxgl.LngLatBounds();
        bounds.extend(origin.coordinates as [number, number]);
        bounds.extend(destination.coordinates as [number, number]);
        map.current.fitBounds(bounds, { padding: 100 });
      }

      toast({
        title: "Route Calculated",
        description: "Route has been successfully calculated",
      });
    } catch (error: any) {
      console.error("Error calculating route:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to calculate route",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Route className="h-5 w-5" />
            Shipping Route Tracker
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sender">Sender Address</Label>
              <Input
                id="sender"
                placeholder="Enter sender address (e.g., Mumbai, Maharashtra)"
                value={senderAddress}
                onChange={(e) => setSenderAddress(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="receiver">Receiver Address</Label>
              <Input
                id="receiver"
                placeholder="Enter receiver address (e.g., Delhi, India)"
                value={receiverAddress}
                onChange={(e) => setReceiverAddress(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>
          <Button onClick={calculateRoute} disabled={loading} className="w-full md:w-auto">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Calculating Route...
              </>
            ) : (
              <>
                <MapPin className="mr-2 h-4 w-4" />
                Calculate Route
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <div
        ref={mapContainer}
        className="w-full h-[500px] rounded-lg border shadow-lg"
      />

      {routeData && originData && destinationData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <MapPin className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Origin</p>
                  <p className="font-semibold line-clamp-2">{originData.placeName}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <MapPin className="h-8 w-8 text-red-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Destination</p>
                  <p className="font-semibold line-clamp-2">{destinationData.placeName}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Route className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Distance</p>
                  <p className="font-semibold text-2xl">{routeData.distance} km</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Travel Time</p>
                  <p className="font-semibold text-2xl">{routeData.duration} hrs</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 lg:col-span-4">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Package className="h-8 w-8 text-orange-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Estimated Shipping Time</p>
                  <p className="font-semibold text-xl">{routeData.shippingTime}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Based on distance: {parseFloat(routeData.distance) < 500 ? "Short" : parseFloat(routeData.distance) < 1500 ? "Medium" : "Long"} range delivery
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ShippingRouteMap;
