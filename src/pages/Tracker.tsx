import { Package, CheckCircle, Clock, Truck, Building2, GraduationCap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Tracker = () => {
  const supplyJourney = [
    {
      stage: "Manufacturing",
      location: "Oxford Publishers - London, UK",
      timestamp: "2024-01-15 09:30 AM",
      blockHash: "0x7f9a5c3e2b1d8f4a6c9e3b7d2f5a8c1e4b7d9f2a5c8e1b4d7f9a2c5e8b1d4f7a",
      status: "completed",
      icon: Building2,
      description: "Batch #245 manufactured and quality checked",
    },
    {
      stage: "Quality Verification",
      location: "Oxford Publishers QA Department",
      timestamp: "2024-01-15 02:45 PM",
      blockHash: "0x3c21a5f8d9e2b7c4f1a6d8e3b5c7f9a2d4e6b8c1f3a5d7e9b2c4f6a8d1e3b5c7",
      status: "completed",
      icon: CheckCircle,
      description: "All items passed quality standards",
    },
    {
      stage: "Warehouse Storage",
      location: "Central Distribution Hub - Manchester",
      timestamp: "2024-01-16 11:20 AM",
      blockHash: "0x9e4b2c8f5a1d7e3b6c9f2a5d8e1b4c7f9a2d5e8b1c4f7a9d2e5b8c1f4a7d9e2",
      status: "completed",
      icon: Package,
      description: "Received at central distribution facility",
    },
    {
      stage: "In Transit",
      location: "En route to Regional Education Office",
      timestamp: "2024-01-17 08:15 AM",
      blockHash: "0x2d5f8a1c4e7b9d3f6a8c1e4b7d9f2a5c8e1b4d7f9a2c5e8b1d4f7a9c2e5d8f1",
      status: "active",
      icon: Truck,
      description: "Currently in transit - ETA 2 hours",
    },
    {
      stage: "School Delivery",
      location: "Lincoln High School",
      timestamp: "Pending",
      blockHash: "Pending verification",
      status: "pending",
      icon: GraduationCap,
      description: "Awaiting delivery confirmation",
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
              <Link to="/dashboard" className="text-muted-foreground hover:text-foreground">
                Dashboard
              </Link>
              <Link to="/tracker" className="text-foreground font-medium">
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
          <h1 className="text-4xl font-bold text-foreground mb-2">Supply Chain Tracker</h1>
          <p className="text-muted-foreground">Tracking: Math Textbooks - Batch #245</p>
        </div>

        <Card className="shadow-elevated mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Current Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 p-4 bg-gradient-card rounded-lg border">
              <div className="bg-primary/10 p-3 rounded-full">
                <Truck className="h-8 w-8 text-primary animate-pulse-soft" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">In Transit</h3>
                <p className="text-muted-foreground">Expected delivery in approximately 2 hours</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-elevated">
          <CardHeader>
            <CardTitle className="text-2xl">Journey Timeline</CardTitle>
            <p className="text-sm text-muted-foreground">Complete blockchain-verified supply chain history</p>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border"></div>
              <div className="space-y-8">
                {supplyJourney.map((stage, index) => (
                  <div key={index} className="relative flex gap-6 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                    <div
                      className={`relative z-10 flex h-16 w-16 items-center justify-center rounded-full border-4 ${
                        stage.status === "completed"
                          ? "bg-secondary border-secondary/20"
                          : stage.status === "active"
                          ? "bg-primary border-primary/20 animate-pulse-soft"
                          : "bg-muted border-muted"
                      }`}
                    >
                      <stage.icon
                        className={`h-7 w-7 ${
                          stage.status === "completed"
                            ? "text-white"
                            : stage.status === "active"
                            ? "text-white"
                            : "text-muted-foreground"
                        }`}
                      />
                    </div>
                    <div className="flex-1 pb-8">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-semibold text-foreground">{stage.stage}</h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                            <Clock className="h-4 w-4" />
                            {stage.timestamp}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            stage.status === "completed"
                              ? "bg-secondary/20 text-secondary"
                              : stage.status === "active"
                              ? "bg-primary/20 text-primary"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {stage.status === "completed" ? "Completed" : stage.status === "active" ? "Active" : "Pending"}
                        </span>
                      </div>
                      <p className="text-sm text-foreground mb-2">{stage.description}</p>
                      <p className="text-sm text-muted-foreground mb-2">{stage.location}</p>
                      {stage.blockHash !== "Pending verification" && (
                        <div className="mt-3 p-3 bg-muted/50 rounded-lg border">
                          <p className="text-xs text-muted-foreground mb-1">Block Hash:</p>
                          <p className="blockchain-hash text-primary break-all">{stage.blockHash}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-8 flex gap-4">
              <Link to="/dashboard" className="flex-1">
                <Button variant="outline" className="w-full">Back to Dashboard</Button>
              </Link>
              <Link to="/verify" className="flex-1">
                <Button className="w-full bg-secondary hover:bg-secondary/90">Verify with QR Code</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Tracker;
