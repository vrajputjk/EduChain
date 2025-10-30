-- Fix security warnings by setting search_path for all functions

-- Update the update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Update the generate_block_hash function
CREATE OR REPLACE FUNCTION public.generate_block_hash(supply_uuid UUID, tx_type TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN '0x' || encode(digest(supply_uuid::text || tx_type || now()::text || random()::text, 'sha256'), 'hex');
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Update the handle_new_user function
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;