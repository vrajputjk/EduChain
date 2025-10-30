import { Package, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const Register = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Supply batch registered successfully on blockchain!", {
      description: "Transaction hash: 0x7f9a5c3e2b1d8f4a...",
    });
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
              <Link to="/register" className="text-foreground font-medium">
                Register Supply
              </Link>
              <Link to="/verify" className="text-muted-foreground hover:text-foreground">
                Verify
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Register New Supply Batch</h1>
          <p className="text-muted-foreground">Create a blockchain record for a new shipment of educational supplies</p>
        </div>

        <Card className="shadow-elevated">
          <CardHeader>
            <CardTitle className="text-2xl">Supply Details</CardTitle>
            <p className="text-sm text-muted-foreground">All information will be recorded on the immutable ledger</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="supplier">Supplier Name</Label>
                <Input id="supplier" placeholder="e.g., Oxford Publishers" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="item-type">Item Type</Label>
                <Input id="item-type" placeholder="e.g., Math Textbooks" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="batch-id">Batch ID</Label>
                  <Input id="batch-id" placeholder="e.g., BATCH-245" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input id="quantity" type="number" placeholder="e.g., 1000" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="destination">Destination</Label>
                <Input id="destination" placeholder="e.g., Lincoln High School, Manchester" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Detailed description of the supplies, including specifications and quality standards..."
                  className="min-h-[100px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="documents">Supporting Documents</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Invoices, certificates, quality reports (PDF, JPG, PNG)
                  </p>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg border">
                <h3 className="font-semibold text-foreground mb-2">Blockchain Registration</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Upon submission, this supply batch will be:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                  <li>Assigned a unique blockchain ID</li>
                  <li>Timestamped with current date and time</li>
                  <li>Made available for public verification</li>
                  <li>Permanently recorded on the immutable ledger</li>
                </ul>
              </div>

              <div className="flex gap-4">
                <Link to="/dashboard" className="flex-1">
                  <Button type="button" variant="outline" className="w-full">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
                  Register on Blockchain
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Register;
