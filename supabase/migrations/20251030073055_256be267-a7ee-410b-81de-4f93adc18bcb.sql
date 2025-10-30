-- Create enum for user roles
CREATE TYPE user_role AS ENUM ('admin', 'supplier', 'distributor', 'school', 'government_official');

-- Create enum for supply status
CREATE TYPE supply_status AS ENUM ('manufactured', 'quality_checked', 'in_warehouse', 'in_transit', 'delivered', 'verified');

-- Create enum for education boards
CREATE TYPE education_board AS ENUM ('CBSE', 'ICSE', 'State Board', 'Other');

-- Create profiles table for user management
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'supplier',
  organization_name TEXT,
  phone TEXT,
  state TEXT,
  district TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create schools table
CREATE TABLE public.schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  state TEXT NOT NULL,
  district TEXT NOT NULL,
  block TEXT,
  pincode TEXT,
  board education_board NOT NULL,
  student_count INTEGER,
  contact_person TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create supplies table
CREATE TABLE public.supplies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id TEXT NOT NULL UNIQUE,
  supplier_id UUID REFERENCES public.profiles(id),
  item_type TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2),
  total_value DECIMAL(12, 2),
  government_scheme TEXT,
  education_board education_board,
  destination_school_id UUID REFERENCES public.schools(id),
  destination_state TEXT NOT NULL,
  destination_district TEXT NOT NULL,
  description TEXT,
  current_status supply_status NOT NULL DEFAULT 'manufactured',
  manufacture_date DATE NOT NULL DEFAULT CURRENT_DATE,
  expected_delivery_date DATE,
  actual_delivery_date DATE,
  qr_code TEXT,
  blockchain_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create transactions table (blockchain-like ledger)
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supply_id UUID NOT NULL REFERENCES public.supplies(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL,
  from_location TEXT NOT NULL,
  to_location TEXT NOT NULL,
  from_party TEXT,
  to_party TEXT,
  status supply_status NOT NULL,
  block_hash TEXT NOT NULL,
  previous_hash TEXT,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  verified_by UUID REFERENCES public.profiles(id),
  notes TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8)
);

-- Create documents table for supporting documents
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supply_id UUID NOT NULL REFERENCES public.supplies(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  uploaded_by UUID REFERENCES public.profiles(id),
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for schools (public read, authenticated write)
CREATE POLICY "Anyone can view schools" ON public.schools FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert schools" ON public.schools FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update schools" ON public.schools FOR UPDATE USING (auth.role() = 'authenticated');

-- RLS Policies for supplies (public read, suppliers can create/update own)
CREATE POLICY "Anyone can view supplies" ON public.supplies FOR SELECT USING (true);
CREATE POLICY "Suppliers can insert supplies" ON public.supplies FOR INSERT WITH CHECK (auth.uid() = supplier_id);
CREATE POLICY "Suppliers can update own supplies" ON public.supplies FOR UPDATE USING (auth.uid() = supplier_id);

-- RLS Policies for transactions (public read, authenticated write)
CREATE POLICY "Anyone can view transactions" ON public.transactions FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert transactions" ON public.transactions FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- RLS Policies for documents (public read, authenticated write)
CREATE POLICY "Anyone can view documents" ON public.documents FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert documents" ON public.documents FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create indexes for better performance
CREATE INDEX idx_supplies_batch_id ON public.supplies(batch_id);
CREATE INDEX idx_supplies_status ON public.supplies(current_status);
CREATE INDEX idx_supplies_state ON public.supplies(destination_state);
CREATE INDEX idx_transactions_supply_id ON public.transactions(supply_id);
CREATE INDEX idx_transactions_timestamp ON public.transactions(timestamp DESC);
CREATE INDEX idx_schools_state_district ON public.schools(state, district);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_supplies_updated_at
  BEFORE UPDATE ON public.supplies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to generate blockchain hash
CREATE OR REPLACE FUNCTION public.generate_block_hash(supply_uuid UUID, tx_type TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN '0x' || encode(digest(supply_uuid::text || tx_type || now()::text || random()::text, 'sha256'), 'hex');
END;
$$ LANGUAGE plpgsql;

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role, organization_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'supplier'),
    NEW.raw_user_meta_data->>'organization_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();