import { Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import {
  INDIAN_STATES,
  DISTRICTS_BY_STATE,
  GOVERNMENT_SCHEMES,
  SUPPLY_CATEGORIES,
  EDUCATION_BOARDS,
} from "@/lib/constants/india";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const [selectedState, setSelectedState] = useState("");
  const [formData, setFormData] = useState({
    itemType: "",
    category: "",
    batchId: "",
    quantity: "",
    unitPrice: "",
    governmentScheme: "",
    educationBoard: "",
    destinationState: "",
    destinationDistrict: "",
    description: "",
  });

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    getUser();
  }, []);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const totalValue = Number(formData.quantity) * Number(formData.unitPrice);

      // Generate blockchain hash
      const { data: hashData, error: hashError } = await supabase
        .rpc("generate_block_hash", {
          supply_uuid: crypto.randomUUID(),
          tx_type: "REGISTRATION",
        });

      if (hashError) throw hashError;

      // Insert supply record
      const { data: supplyData, error: supplyError } = await supabase
        .from("supplies")
        .insert([{
          batch_id: formData.batchId,
          supplier_id: userId,
          item_type: formData.itemType,
          category: formData.category,
          quantity: Number(formData.quantity),
          unit_price: Number(formData.unitPrice),
          total_value: totalValue,
          government_scheme: formData.governmentScheme || null,
          education_board: formData.educationBoard as any,
          destination_state: formData.destinationState,
          destination_district: formData.destinationDistrict,
          description: formData.description,
          blockchain_hash: hashData,
          current_status: "manufactured" as any,
        }])
        .select()
        .single();

      if (supplyError) throw supplyError;

      // Create initial transaction record
      await supabase.from("transactions").insert({
        supply_id: supplyData.id,
        transaction_type: "Manufacturing Complete",
        from_location: "Manufacturing Unit",
        to_location: "Warehouse",
        status: "manufactured",
        block_hash: hashData,
      });

      toast.success("Supply batch registered successfully!", {
        description: `Batch ID: ${formData.batchId} | Blockchain Hash: ${hashData?.substring(0, 20)}...`,
      });

      navigate("/dashboard");
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "Failed to register supply batch");
    } finally {
      setLoading(false);
    }
  };

  const districts = selectedState ? DISTRICTS_BY_STATE[selectedState] || [] : [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar currentPage="register" />

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Register New Supply Batch</h1>
          <p className="text-muted-foreground">
            Create a blockchain record for educational supplies under Government of India schemes
          </p>
        </div>

        <Card className="shadow-elevated">
          <CardHeader>
            <CardTitle className="text-2xl">Supply Details</CardTitle>
            <p className="text-sm text-muted-foreground">
              All information will be recorded on the immutable blockchain ledger
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {SUPPLY_CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="itemType">Item Type *</Label>
                  <Input
                    id="itemType"
                    placeholder="e.g., NCERT Class 10 Math"
                    value={formData.itemType}
                    onChange={(e) => setFormData({ ...formData, itemType: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="batchId">Batch ID *</Label>
                  <Input
                    id="batchId"
                    placeholder="e.g., EDU-2025-001"
                    value={formData.batchId}
                    onChange={(e) => setFormData({ ...formData, batchId: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="Number of items"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    required
                    min="1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="unitPrice">Unit Price (₹) *</Label>
                <Input
                  id="unitPrice"
                  type="number"
                  placeholder="Price per unit in Rupees"
                  value={formData.unitPrice}
                  onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                  required
                  min="0"
                  step="0.01"
                />
                {formData.quantity && formData.unitPrice && (
                  <p className="text-sm text-muted-foreground">
                    Total Value: ₹{(Number(formData.quantity) * Number(formData.unitPrice)).toLocaleString("en-IN")}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="governmentScheme">Government Scheme</Label>
                  <Select
                    value={formData.governmentScheme}
                    onValueChange={(value) => setFormData({ ...formData, governmentScheme: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select scheme" />
                    </SelectTrigger>
                    <SelectContent>
                      {GOVERNMENT_SCHEMES.map((scheme) => (
                        <SelectItem key={scheme.value} value={scheme.value}>
                          {scheme.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="educationBoard">Education Board</Label>
                  <Select
                    value={formData.educationBoard}
                    onValueChange={(value) => setFormData({ ...formData, educationBoard: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select board" />
                    </SelectTrigger>
                    <SelectContent>
                      {EDUCATION_BOARDS.map((board) => (
                        <SelectItem key={board.value} value={board.value}>
                          {board.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="destinationState">Destination State *</Label>
                  <Select
                    value={formData.destinationState}
                    onValueChange={(value) => {
                      setFormData({ ...formData, destinationState: value, destinationDistrict: "" });
                      setSelectedState(value);
                    }}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {INDIAN_STATES.map((state) => (
                        <SelectItem key={state.value} value={state.value}>
                          {state.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="destinationDistrict">Destination District *</Label>
                  <Select
                    value={formData.destinationDistrict}
                    onValueChange={(value) => setFormData({ ...formData, destinationDistrict: value })}
                    required
                    disabled={!selectedState}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select district" />
                    </SelectTrigger>
                    <SelectContent>
                      {districts.map((district) => (
                        <SelectItem key={district} value={district}>
                          {district}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Detailed description including quality standards, specifications, etc..."
                  className="min-h-[100px]"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="bg-muted/50 p-4 rounded-lg border">
                <h3 className="font-semibold text-foreground mb-2">🔐 Blockchain Registration</h3>
                <p className="text-sm text-muted-foreground mb-2">Upon submission, this supply batch will be:</p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                  <li>Assigned a unique blockchain ID (SHA-256 hash)</li>
                  <li>Timestamped with IST (Indian Standard Time)</li>
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
                <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90" disabled={loading}>
                  {loading ? "Registering..." : "Register on Blockchain"}
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