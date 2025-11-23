import { Package, CheckCircle, Clock, Truck, Building2, GraduationCap, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { format } from "date-fns";
import { toast } from "sonner";

interface Supply {
  id: string;
  batch_id: string;
  item_type: string;
  quantity: number;
  current_status: string;
  destination_state: string;
  destination_district: string;
  blockchain_hash: string | null;
}

interface Transaction {
  id: string;
  transaction_type: string;
  from_location: string;
  to_location: string;
  status: string;
  timestamp: string;
  block_hash: string;
}

const Tracker = () => {
  const [batchId, setBatchId] = useState("");
  const [supply, setSupply] = useState<Supply | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchId.trim()) {
      toast.error("Please enter a Batch ID");
      return;
    }

    setLoading(true);
    try {
      // Search for supply by batch_id
      const { data: supplyData, error: supplyError } = await supabase
        .from("supplies")
        .select("*")
        .eq("batch_id", batchId.trim())
        .single();

      if (supplyError || !supplyData) {
        toast.error("Supply batch not found. Please check the Batch ID.");
        setSupply(null);
        setTransactions([]);
        setSearched(true);
        return;
      }

      setSupply(supplyData);

      // Fetch transactions for this supply
      const { data: txData, error: txError } = await supabase
        .from("transactions")
        .select("*")
        .eq("supply_id", supplyData.id)
        .order("timestamp", { ascending: true });

      if (!txError && txData) {
        setTransactions(txData);
      }

      setSearched(true);
      toast.success("Supply batch found!");
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch supply data");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "manufactured":
        return Building2;
      case "quality_checked":
        return CheckCircle;
      case "in_warehouse":
        return Package;
      case "in_transit":
        return Truck;
      case "delivered":
      case "verified":
        return GraduationCap;
      default:
        return Package;
    }
  };

  const getStatusColor = (status: string) => {
    if (status === "delivered" || status === "verified") {
      return "bg-secondary border-secondary/20 text-white";
    }
    return "bg-primary border-primary/20 text-white animate-pulse-soft";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar currentPage="tracker" />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Supply Chain Tracker</h1>
          <p className="text-muted-foreground">Track your supply batches in real-time across India 🇮🇳</p>
        </div>

        <Card className="shadow-elevated mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Search Supply Batch</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="batch-id">Batch ID</Label>
                <Input
                  id="batch-id"
                  placeholder="e.g., BATCH-2024-001"
                  value={batchId}
                  onChange={(e) => setBatchId(e.target.value)}
                  disabled={loading}
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Searching..." : "Track Supply"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {searched && !supply && (
          <Card className="shadow-elevated">
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Supply Not Found</h3>
                <p className="text-muted-foreground mb-4">
                  No supply batch found with the provided Batch ID.
                </p>
                <Link to="/register">
                  <Button>Register New Supply Batch</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {supply && (
          <>
            <Card className="shadow-elevated mb-8">
              <CardHeader>
                <CardTitle className="text-2xl">Supply Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Batch ID</p>
                    <p className="font-medium text-foreground">{supply.batch_id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Item Type</p>
                    <p className="font-medium text-foreground">{supply.item_type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Quantity</p>
                    <p className="font-medium text-foreground">{supply.quantity} units</p>
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
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Destination</p>
                    <p className="font-medium text-foreground">
                      {supply.destination_district}, {supply.destination_state}
                    </p>
                  </div>
                  {supply.blockchain_hash && (
                    <div className="md:col-span-2 lg:col-span-3">
                      <p className="text-sm text-muted-foreground mb-1">Blockchain Hash</p>
                      <p className="blockchain-hash text-primary break-all text-sm">
                        {supply.blockchain_hash}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-elevated">
              <CardHeader>
                <CardTitle className="text-2xl">Journey Timeline</CardTitle>
                <p className="text-sm text-muted-foreground">Complete blockchain-verified supply chain history</p>
              </CardHeader>
              <CardContent>
                {transactions.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No transactions recorded yet</p>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border"></div>
                    <div className="space-y-8">
                      {transactions.map((tx, index) => {
                        const StatusIcon = getStatusIcon(tx.status);
                        const isCompleted = index < transactions.length - 1;
                        const isActive = index === transactions.length - 1 && supply.current_status !== "delivered";

                        return (
                          <div
                            key={tx.id}
                            className="relative flex gap-6 animate-fade-in"
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            <div
                              className={`relative z-10 flex h-16 w-16 items-center justify-center rounded-full border-4 ${
                                isCompleted
                                  ? "bg-secondary border-secondary/20"
                                  : isActive
                                  ? "bg-primary border-primary/20 animate-pulse-soft"
                                  : "bg-muted border-muted"
                              }`}
                            >
                              <StatusIcon
                                className={`h-7 w-7 ${
                                  isCompleted || isActive ? "text-white" : "text-muted-foreground"
                                }`}
                              />
                            </div>
                            <div className="flex-1 pb-8">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className="text-xl font-semibold text-foreground">{tx.transaction_type}</h3>
                                  <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                    <Clock className="h-4 w-4" />
                                    {format(new Date(tx.timestamp), "MMM dd, yyyy h:mm a")}
                                  </p>
                                </div>
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    isCompleted
                                      ? "bg-secondary/20 text-secondary"
                                      : isActive
                                      ? "bg-primary/20 text-primary"
                                      : "bg-muted text-muted-foreground"
                                  }`}
                                >
                                  {isCompleted ? "Completed" : isActive ? "Active" : "Pending"}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {tx.from_location} → {tx.to_location}
                              </p>
                              <div className="mt-3 p-3 bg-muted/50 rounded-lg border">
                                <p className="text-xs text-muted-foreground mb-1">Block Hash:</p>
                                <p className="blockchain-hash text-primary break-all text-sm">{tx.block_hash}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                <div className="mt-8 flex gap-4">
                  <Link to="/dashboard" className="flex-1">
                    <Button variant="outline" className="w-full">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Dashboard
                    </Button>
                  </Link>
                  <Link to="/verify" className="flex-1">
                    <Button className="w-full bg-secondary hover:bg-secondary/90">Verify Authenticity</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
};

export default Tracker;
