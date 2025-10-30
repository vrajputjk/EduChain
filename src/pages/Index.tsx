import { Package, Shield, TrendingUp, Users, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-primary">EduChain</span>
            </div>
            <nav className="flex items-center space-x-6">
              <a href="#features" className="text-muted-foreground hover:text-foreground">
                Features
              </a>
              <a href="#how-it-works" className="text-muted-foreground hover:text-foreground">
                How It Works
              </a>
              <Link to="/dashboard">
                <Button className="bg-primary hover:bg-primary/90">Get Started</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-10"></div>
        <div className="container mx-auto px-4 py-24 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 animate-fade-in">
              Transparent Distribution of
              <span className="text-primary"> Educational Supplies</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: "100ms" }}>
              Track every school supply from manufacturers to students using blockchain technology.
              Ensure accountability, prevent corruption, and build trust in the education supply chain.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "200ms" }}>
              <Link to="/dashboard">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8">
                  View Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/verify">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Verify Supply
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Why EduChain?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Blockchain-powered transparency ensures every textbook, uniform, and supply reaches its intended recipient
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                title: "Prevent Corruption",
                description: "Immutable records prevent theft, fraud, and manipulation of supply data",
              },
              {
                icon: TrendingUp,
                title: "Full Traceability",
                description: "Track every item from production to delivery with complete transparency",
              },
              {
                icon: CheckCircle,
                title: "Smart Verification",
                description: "Automated smart contracts ensure compliance and genuine item distribution",
              },
              {
                icon: Users,
                title: "Build Trust",
                description: "Parents, schools, and governments can verify supply authenticity",
              },
            ].map((feature, index) => (
              <Card key={index} className="shadow-soft animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <CardContent className="pt-6">
                  <div className="bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                    <feature.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Simple, transparent, and secure supply chain tracking powered by blockchain
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-12">
            {[
              {
                step: "01",
                title: "Supplier Registration",
                description: "Manufacturers and suppliers register on the blockchain with verified credentials",
              },
              {
                step: "02",
                title: "Item Creation & Tokenization",
                description: "Each supply batch receives a unique blockchain ID and QR code for tracking",
              },
              {
                step: "03",
                title: "Smart Contract Automation",
                description: "Automated approvals, payments, and receipt confirmations via smart contracts",
              },
              {
                step: "04",
                title: "Real-time Tracking",
                description: "Every handover is recorded on the blockchain with timestamps and verification",
              },
              {
                step: "05",
                title: "Public Verification",
                description: "Anyone can verify authenticity and trace the complete journey of supplies",
              },
            ].map((step, index) => (
              <div key={index} className="flex gap-6 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-gradient-hero flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">{step.step}</span>
                  </div>
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="text-2xl font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-lg">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Transform Education Supply Chains?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join the movement for transparent, accountable distribution of educational resources
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8">
              Register Your First Batch
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t bg-card py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Package className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-primary">EduChain</span>
            </div>
            <p className="text-muted-foreground text-sm">
              © 2024 EduChain. Blockchain-powered education supply tracking.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
