import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Play, Square, Loader2 } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type Supply = Database["public"]["Tables"]["supplies"]["Row"];

// Sample route coordinates across India
const ROUTE_COORDINATES = [
  { lat: 28.7041, lng: 77.1025, name: "Delhi" },
  { lat: 27.1767, lng: 78.0081, name: "Agra" },
  { lat: 26.9124, lng: 75.7873, name: "Jaipur" },
  { lat: 23.0225, lng: 72.5714, name: "Ahmedabad" },
  { lat: 19.0760, lng: 72.8777, name: "Mumbai" },
  { lat: 18.5204, lng: 73.8567, name: "Pune" },
  { lat: 17.3850, lng: 78.4867, name: "Hyderabad" },
  { lat: 13.0827, lng: 80.2707, name: "Chennai" },
  { lat: 12.9716, lng: 77.5946, name: "Bangalore" },
  { lat: 22.5726, lng: 88.3639, name: "Kolkata" },
];

const GPSSimulator = () => {
  const [supplies, setSupplies] = useState<Supply[]>([]);
  const [selectedSupply, setSelectedSupply] = useState<string>("");
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchInTransitSupplies();
  }, []);

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
      setSupplies(data);
    }
  };

  const updateLocation = async (supplyId: string, lat: number, lng: number, locationName: string) => {
    try {
      const { error } = await supabase.rpc("update_supply_location", {
        p_supply_id: supplyId,
        p_latitude: lat,
        p_longitude: lng,
        p_location_name: locationName,
      });

      if (error) throw error;

      console.log(`GPS updated: ${locationName} (${lat}, ${lng})`);
    } catch (error: any) {
      console.error("Error updating location:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const startSimulation = () => {
    if (!selectedSupply) {
      toast({
        title: "Select Supply",
        description: "Please select a supply to track",
        variant: "destructive",
      });
      return;
    }

    setIsSimulating(true);
    setCurrentIndex(0);

    const id = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % ROUTE_COORDINATES.length;
        const coord = ROUTE_COORDINATES[nextIndex];
        
        updateLocation(selectedSupply, coord.lat, coord.lng, coord.name);
        
        return nextIndex;
      });
    }, 5000); // Update every 5 seconds

    setIntervalId(id);

    toast({
      title: "Simulation Started",
      description: "GPS updates will occur every 5 seconds",
    });
  };

  const stopSimulation = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setIsSimulating(false);

    toast({
      title: "Simulation Stopped",
      description: "GPS tracking has been paused",
    });
  };

  const sendManualUpdate = async () => {
    if (!selectedSupply) {
      toast({
        title: "Select Supply",
        description: "Please select a supply first",
        variant: "destructive",
      });
      return;
    }

    const coord = ROUTE_COORDINATES[currentIndex];
    await updateLocation(selectedSupply, coord.lat, coord.lng, coord.name);

    toast({
      title: "Location Updated",
      description: `Updated to ${coord.name}`,
    });

    setCurrentIndex((prev) => (prev + 1) % ROUTE_COORDINATES.length);
  };

  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          GPS Location Simulator
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Simulate GPS updates for supplies in transit
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Select Supply</Label>
          <Select value={selectedSupply} onValueChange={setSelectedSupply}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a supply batch" />
            </SelectTrigger>
            <SelectContent>
              {supplies.length === 0 ? (
                <SelectItem value="none" disabled>
                  No supplies in transit
                </SelectItem>
              ) : (
                supplies.map((supply) => (
                  <SelectItem key={supply.id} value={supply.id}>
                    {supply.batch_id} - {supply.item_type}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        {supplies.length === 0 && (
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-sm text-yellow-600">
              No supplies in transit. Update a supply's status to "in_transit" to test GPS tracking.
            </p>
          </div>
        )}

        <div className="space-y-2">
          <Label>Current Location</Label>
          <Input
            value={ROUTE_COORDINATES[currentIndex]?.name || ""}
            disabled
            className="font-mono"
          />
          <p className="text-xs text-muted-foreground">
            Lat: {ROUTE_COORDINATES[currentIndex]?.lat}, Lng: {ROUTE_COORDINATES[currentIndex]?.lng}
          </p>
        </div>

        <div className="flex gap-2">
          {!isSimulating ? (
            <Button
              onClick={startSimulation}
              disabled={!selectedSupply || supplies.length === 0}
              className="flex-1"
            >
              <Play className="h-4 w-4 mr-2" />
              Start Auto-Simulation
            </Button>
          ) : (
            <Button onClick={stopSimulation} variant="destructive" className="flex-1">
              <Square className="h-4 w-4 mr-2" />
              Stop Simulation
            </Button>
          )}

          <Button
            onClick={sendManualUpdate}
            variant="outline"
            disabled={!selectedSupply || supplies.length === 0}
          >
            <MapPin className="h-4 w-4 mr-2" />
            Manual Update
          </Button>
        </div>

        {isSimulating && (
          <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <Loader2 className="h-4 w-4 animate-spin text-green-500" />
            <p className="text-sm text-green-600">
              Simulating GPS updates every 5 seconds...
            </p>
          </div>
        )}

        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            <strong>Note:</strong> This simulator cycles through major Indian cities to demonstrate
            real-time GPS tracking. Updates are sent every 5 seconds in auto mode.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default GPSSimulator;
