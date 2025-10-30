import { Package, TrendingUp, Users, CheckCircle, IndianRupee } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatIndianCurrency } from "@/lib/constants/india";
import { format } from "date-fns";

interface Stats {
  activeShipments: number;
  verifiedSuppliers: number;
  itemsDelivered: number;
  totalValue: number;
}

interface Transaction {
  id: string;
  supply_id: string;
  transaction_type: string;
  from_location: string;
  to_location: string;
  status: string;
  timestamp: string;
  supplies: {
    batch_id: string;
    item_type: string;
    quantity: number;
  };
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({
    activeShipments: 0,
    verifiedSuppliers: 0,
    itemsDelivered: 0,
    totalValue: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch active shipments count
        const { count: activeCount } = await supabase
          .from("supplies")
          .select("*", { count: "exact", head: true })
          .in("current_status", ["in_transit", "in_warehouse"]);

        // Fetch delivered items count
        const { count: deliveredCount } = await supabase
          .from("supplies")
          .select("*", { count: "exact", head: true })
          .eq("current_status", "delivered");

        // Fetch verified suppliers count
        const { count: suppliersCount } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .eq("role", "supplier");

        // Fetch total value
        const { data: supplies } = await supabase
          .from("supplies")
          .select("total_value");

        const totalValue = supplies?.reduce((sum, s) => sum + (Number(s.total_value) || 0), 0) || 0;

        setStats({
          activeShipments: activeCount || 0,
          verifiedSuppliers: suppliersCount || 0,
          itemsDelivered: deliveredCount || 0,
          totalValue,
        });

        // Fetch recent transactions
        const { data: transactions } = await supabase
          .from("transactions")
          .select(`
            *,
            supplies (
              batch_id,
              item_type,
              quantity
            )
          `)
          .order("timestamp", { ascending: false })
          .limit(5);

        setRecentTransactions(transactions || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    // Set up realtime subscription for new transactions
    const channel = supabase
      .channel("transactions_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "transactions",
        },
        () => {
          fetchDashboardData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const statsData = [
    { title: "Active Shipments", value: stats.activeShipments.toString(), icon: Package, change: "Real-time" },
    { title: "Verified Suppliers", value: stats.verifiedSuppliers.toString(), icon: Users, change: "Pan-India" },
    { title: "Items Delivered", value: stats.itemsDelivered.toLocaleString("en-IN"), icon: CheckCircle, change: "All States" },
    { title: "Total Value", value: formatIndianCurrency(stats.totalValue), icon: IndianRupee, change: "INR" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar currentPage="dashboard" />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar currentPage="dashboard" />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Supply Chain Dashboard</h1>
          <p className="text-muted-foreground">Real-time tracking of educational supplies across India 🇮🇳</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat, index) => (
            <Card key={index} className="shadow-soft animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <stat.icon className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-secondary mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="shadow-elevated mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Recent Blockchain Transactions</CardTitle>
            <p className="text-sm text-muted-foreground">
              Latest supply chain movements recorded on the immutable ledger
            </p>
          </CardHeader>
          <CardContent>
            {recentTransactions.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No transactions yet</p>
                <Link to="/register">
                  <Button>Register First Supply Batch</Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {recentTransactions.map((tx, index) => (
                    <div
                      key={index}
                      className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border bg-gradient-card hover:shadow-soft transition-all"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="blockchain-hash text-primary text-sm">
                            {tx.supplies?.batch_id || "N/A"}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              tx.status === "delivered"
                                ? "bg-secondary/20 text-secondary"
                                : tx.status === "verified"
                                ? "bg-accent/20 text-accent"
                                : "bg-primary/20 text-primary"
                            }`}
                          >
                            {tx.status}
                          </span>
                        </div>
                        <h3 className="font-semibold text-foreground mb-1">
                          {tx.supplies?.item_type} - {tx.supplies?.quantity} units
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {tx.from_location} → {tx.to_location}
                        </p>
                      </div>
                      <div className="mt-2 md:mt-0 text-sm text-muted-foreground">
                        {format(new Date(tx.timestamp), "MMM dd, yyyy h:mm a")}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex justify-center">
                  <Link to="/tracker">
                    <Button className="bg-primary hover:bg-primary/90">View All Transactions</Button>
                  </Link>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;