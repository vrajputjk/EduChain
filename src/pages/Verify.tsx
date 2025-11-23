import { Package, QrCode, CheckCircle, Shield, XCircle, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { format } from "date-fns";

interface Supply {
  id: string;
  batch_id: string;
  item_type: string;
  quantity: number;
  current_status: string;
  destination_state: string;
  destination_district: string;
  blockchain_hash: string | null;
  manufacture_date: string;
  supplier_id: string;
  profiles?: {
    full_name: string;
    organization_name: string | null;
  };
}

const Verify = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [supply, setSupply] = useState<Supply | null>(null);
  const [verified, setVerified] = useState<boolean | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      toast.error("Please enter a Batch ID or Blockchain Hash");
      return;
    }

    setLoading(true);
    setVerified(null);
    setSupply(null);

    try {
      // Try to find by batch_id first
      let { data: supplyData, error: supplyError } = await supabase
        .from("supplies")
        .select(`
          *,
          profiles:supplier_id (
            full_name,
            organization_name
          )
        `)
        .eq("batch_id", searchQuery.trim())
        .single();

      // If not found, try by blockchain_hash
      if (supplyError || !supplyData) {
        const { data: hashData, error: hashError } = await supabase
          .from("supplies")
          .select(`
            *,
            profiles:supplier_id (
              full_name,
              organization_name
            )
          `)
          .eq("blockchain_hash", searchQuery.trim())
          .single();

        if (hashError || !hashData) {
          setVerified(false);
          toast.error("Supply not found in blockchain ledger");
          return;
        }

        supplyData = hashData;
      }

      setSupply(supplyData);
      setVerified(true);
      toast.success("Supply verified successfully!");
    } catch (error: any) {
      setVerified(false);
      toast.error(error.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar currentPage="verify" />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Verify Supply Authenticity</h1>
          <p className="text-muted-foreground">Check if an item is genuine by verifying it against the blockchain ledger</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="shadow-elevated">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <QrCode className="h-5 w-5 text-primary" />
                Scan QR Code
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-square bg-gradient-card rounded-lg border-2 border-dashed border-border flex items-center justify-center">
                <div className="text-center">
                  <QrCode className="h-24 w-24 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground mb-2">QR code scanning coming soon</p>
                  <p className="text-xs text-muted-foreground">Use manual entry for now</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-elevated">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Manual Entry
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleVerify} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="batch-id">Batch ID or Blockchain Hash</Label>
                  <Input
                    id="batch-id"
                    placeholder="e.g., BATCH-2024-001 or 0x7f9a..."
                    className="blockchain-hash"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full bg-secondary hover:bg-secondary/90">
                  {loading ? "Verifying..." : "Verify Item"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {verified === false && (
          <Card className="shadow-elevated animate-fade-in border-destructive">
            <CardHeader className="bg-destructive/10">
              <CardTitle className="text-2xl flex items-center gap-2 text-destructive">
                <XCircle className="h-6 w-6" />
                Verification Failed
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  This supply could not be verified. It may not exist in the blockchain ledger or the identifier is incorrect.
                </p>
                <Button onClick={() => setVerified(null)} variant="outline">
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {verified && supply && (
          <Card className="shadow-elevated animate-fade-in border-secondary">
            <CardHeader className="bg-secondary/10">
              <CardTitle className="text-2xl flex items-center gap-2 text-secondary">
                <CheckCircle className="h-6 w-6" />
                Verification Successful
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 bg-gradient-card rounded-lg border">
                  <div className="bg-secondary/10 p-3 rounded-full">
                    <Shield className="h-6 w-6 text-secondary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">Authentic Supply Verified ✓</h3>
                    <p className="text-sm text-muted-foreground">
                      This item has been verified against the blockchain ledger and confirmed as genuine.
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Item</p>
                    <p className="font-medium text-foreground">{supply.item_type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Batch ID</p>
                    <p className="font-medium text-foreground">{supply.batch_id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Supplier</p>
                    <p className="font-medium text-foreground">
                      {supply.profiles?.organization_name || supply.profiles?.full_name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Quantity</p>
                    <p className="font-medium text-foreground">{supply.quantity} units</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Manufacture Date</p>
                    <p className="font-medium text-foreground">
                      {format(new Date(supply.manufacture_date), "MMMM dd, yyyy")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Current Status</p>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        supply.current_status === "delivered" || supply.current_status === "verified"
                          ? "bg-secondary/20 text-secondary"
                          : "bg-primary/20 text-primary"
                      }`}
                    >
                      {supply.current_status.replace("_", " ").toUpperCase()}
                    </span>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-muted-foreground mb-1">Destination</p>
                    <p className="font-medium text-foreground">
                      {supply.destination_district}, {supply.destination_state}
                    </p>
                  </div>
                </div>

                {supply.blockchain_hash && (
                  <div className="p-4 bg-muted/50 rounded-lg border">
                    <p className="text-xs text-muted-foreground mb-1">Blockchain Hash:</p>
                    <p className="blockchain-hash text-primary break-all text-sm">
                      {supply.blockchain_hash}
                    </p>
                  </div>
                )}

                <div className="flex gap-4">
                  <Link to="/tracker" className="flex-1">
                    <Button className="w-full bg-primary hover:bg-primary/90">
                      View Full Journey
                    </Button>
                  </Link>
                  <Link to="/dashboard" className="flex-1">
                    <Button variant="outline" className="w-full">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="shadow-soft mt-8">
          <CardHeader>
            <CardTitle>Why Verify?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Prevent Fraud</h3>
                <p className="text-sm text-muted-foreground">
                  Ensure supplies are authentic and not counterfeit
                </p>
              </div>
              <div className="text-center">
                <div className="bg-secondary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Build Trust</h3>
                <p className="text-sm text-muted-foreground">
                  Verify the complete supply chain history
                </p>
              </div>
              <div className="text-center">
                <div className="bg-accent/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Package className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Track Journey</h3>
                <p className="text-sm text-muted-foreground">
                  See the full path from supplier to student
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Verify;
