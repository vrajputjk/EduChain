import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { action, origin, destination } = await req.json();
    const mapboxToken = Deno.env.get("MAPBOX_ACCESS_TOKEN");

    if (!mapboxToken) {
      throw new Error("MAPBOX_ACCESS_TOKEN not configured");
    }

    if (action === "geocode") {
      // Geocode both addresses
      const originResponse = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(origin)}.json?access_token=${mapboxToken}&country=IN&limit=1`
      );
      const originData = await originResponse.json();

      const destinationResponse = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(destination)}.json?access_token=${mapboxToken}&country=IN&limit=1`
      );
      const destinationData = await destinationResponse.json();

      if (!originData.features?.length || !destinationData.features?.length) {
        return new Response(
          JSON.stringify({ error: "Unable to geocode one or both addresses" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({
          origin: {
            coordinates: originData.features[0].center,
            placeName: originData.features[0].place_name,
          },
          destination: {
            coordinates: destinationData.features[0].center,
            placeName: destinationData.features[0].place_name,
          },
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "route") {
      // Get route between two coordinates
      const { originCoords, destinationCoords } = await req.json();
      
      const routeResponse = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${originCoords[0]},${originCoords[1]};${destinationCoords[0]},${destinationCoords[1]}?geometries=geojson&access_token=${mapboxToken}`
      );
      const routeData = await routeResponse.json();

      if (!routeData.routes?.length) {
        return new Response(
          JSON.stringify({ error: "Unable to calculate route" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const route = routeData.routes[0];
      const distanceKm = (route.distance / 1000).toFixed(2);
      const durationHours = (route.duration / 3600).toFixed(2);

      // Calculate shipping time based on distance
      let shippingTime = "";
      const distance = parseFloat(distanceKm);
      if (distance < 500) {
        shippingTime = "1-3 days";
      } else if (distance < 1500) {
        shippingTime = "3-5 days";
      } else {
        shippingTime = "5-10 days";
      }

      return new Response(
        JSON.stringify({
          geometry: route.geometry,
          distance: distanceKm,
          duration: durationHours,
          shippingTime,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An error occurred";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
