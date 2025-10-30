import { Package, QrCode, CheckCircle, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { useState } from "react";

const Verify = () => {
  const [verified, setVerified] = useState(false);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setVerified(true);
  };

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
              <Link to="/tracker" className="text-muted-foreground hover:text-foreground">
                Track Items
              </Link>
              <Link to="/register" className="text-muted-foreground hover:text-foreground">
                Register Supply
              </Link>
              <Link to="/verify" className="text-foreground font-medium">
                Verify
              </Link>
            </nav>
          </div>
        </div>
      </header>

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
                  <p className="text-sm text-muted-foreground">Camera access required</p>
                  <Button className="mt-4" variant="outline">
                    Enable Camera
                  </Button>
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
                    placeholder="e.g., BATCH-245 or 0x7f9a..."
                    className="blockchain-hash"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="item-code">Item Code (Optional)</Label>
                  <Input
                    id="item-code"
                    placeholder="e.g., MTH-TXT-2024"
                  />
                </div>
                <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90">
                  Verify Item
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {verified && (
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
                    <h3 className="font-semibold text-foreground mb-1">Authentic Supply Verified</h3>
                    <p className="text-sm text-muted-foreground">
                      This item has been verified against the blockchain ledger and confirmed as genuine.
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Item</p>
                    <p className="font-medium text-foreground">Math Textbooks - Batch #245</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Supplier</p>
                    <p className="font-medium text-foreground">Oxford Publishers</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Manufacture Date</p>
                    <p className="font-medium text-foreground">January 15, 2024</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Current Status</p>
                    <p className="font-medium text-secondary">In Transit</p>
                  </div>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg border">
                  <p className="text-xs text-muted-foreground mb-1">Blockchain Hash:</p>
                  <p className="blockchain-hash text-primary break-all">
                    0x7f9a5c3e2b1d8f4a6c9e3b7d2f5a8c1e4b7d9f2a5c8e1b4d7f9a2c5e8b1d4f7a
                  </p>
                </div>

                <Link to="/tracker">
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    View Full Journey
                  </Button>
                </Link>
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
