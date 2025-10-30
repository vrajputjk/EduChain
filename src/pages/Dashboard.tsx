import { Package, TrendingUp, Users, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const stats = [
    { title: "Active Shipments", value: "127", icon: Package, change: "+12%" },
    { title: "Verified Suppliers", value: "34", icon: Users, change: "+5%" },
    { title: "Items Delivered", value: "8,456", icon: CheckCircle, change: "+23%" },
    { title: "Transparency Rate", value: "99.8%", icon: TrendingUp, change: "+0.2%" },
  ];

  const recentTransactions = [
    {
      id: "0x7f9a...3c21",
      item: "Math Textbooks - Batch #245",
      from: "Oxford Publishers",
      to: "Regional Education Office",
      status: "In Transit",
      timestamp: "2 hours ago",
    },
    {
      id: "0x4b2e...8d15",
      item: "Student Uniforms - Batch #189",
      from: "UniThread Manufacturing",
      to: "Lincoln High School",
      status: "Delivered",
      timestamp: "5 hours ago",
    },
    {
      id: "0x9c5f...1a76",
      item: "Science Lab Equipment - Batch #067",
      from: "EduTech Supplies",
      to: "Central Distribution Hub",
      status: "Verified",
      timestamp: "1 day ago",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-primary">EduChain</span>
            </Link>
            <nav className="flex items-center space-x-6">
              <Link to="/dashboard" className="text-foreground font-medium">
                Dashboard
              </Link>
              <Link to="/tracker" className="text-muted-foreground hover:text-foreground">
                Track Items
              </Link>
              <Link to="/register" className="text-muted-foreground hover:text-foreground">
                Register Supply
              </Link>
              <Link to="/verify" className="text-muted-foreground hover:text-foreground">
                Verify
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Supply Chain Dashboard</h1>
          <p className="text-muted-foreground">Real-time tracking of educational supplies distribution</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="shadow-soft animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <stat.icon className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-secondary mt-1">
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="shadow-elevated mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Recent Blockchain Transactions</CardTitle>
            <p className="text-sm text-muted-foreground">Latest supply chain movements recorded on the ledger</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((tx, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border bg-gradient-card hover:shadow-soft transition-all"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="blockchain-hash text-primary">{tx.id}</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          tx.status === "Delivered"
                            ? "bg-secondary/20 text-secondary"
                            : tx.status === "Verified"
                            ? "bg-accent/20 text-accent"
                            : "bg-primary/20 text-primary"
                        }`}
                      >
                        {tx.status}
                      </span>
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{tx.item}</h3>
                    <p className="text-sm text-muted-foreground">
                      {tx.from} → {tx.to}
                    </p>
                  </div>
                  <div className="mt-2 md:mt-0 text-sm text-muted-foreground">{tx.timestamp}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-center">
              <Link to="/tracker">
                <Button className="bg-primary hover:bg-primary/90">View All Transactions</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
