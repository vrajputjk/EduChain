-- Create user_roles table using existing user_role enum
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role user_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role user_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policy for user_roles: users can view their own roles
CREATE POLICY "Users can view own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- RLS policy for user_roles: only admins can insert roles
CREATE POLICY "Admins can insert roles"
ON public.user_roles
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS policy for user_roles: only admins can update roles
CREATE POLICY "Admins can update roles"
ON public.user_roles
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- RLS policy for user_roles: only admins can delete roles
CREATE POLICY "Admins can delete roles"
ON public.user_roles
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Migrate existing roles from profiles to user_roles table
INSERT INTO public.user_roles (user_id, role)
SELECT id, role FROM public.profiles
WHERE role IS NOT NULL
ON CONFLICT (user_id, role) DO NOTHING;

-- Update profiles table RLS policies
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- New policy: users can only view their own profile
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- New policy: users can update own profile but NOT the role column
CREATE POLICY "Users can update own profile except role"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id AND role = (SELECT role FROM public.profiles WHERE id = auth.uid()));

-- Update documents RLS policies
DROP POLICY IF EXISTS "Anyone can view documents" ON public.documents;

-- New policy: only uploaded user can view their documents
CREATE POLICY "Users can view own documents"
ON public.documents
FOR SELECT
USING (auth.uid() = uploaded_by);

-- Update supplies table to make supplier_id NOT NULL
-- First set NULL values to a default (this should be empty for new projects)
UPDATE public.supplies SET supplier_id = '00000000-0000-0000-0000-000000000000'::uuid WHERE supplier_id IS NULL;
ALTER TABLE public.supplies ALTER COLUMN supplier_id SET NOT NULL;

-- Update supplies RLS policies
DROP POLICY IF EXISTS "Suppliers can update own supplies" ON public.supplies;

-- New policy: only suppliers can update their own supplies
CREATE POLICY "Suppliers can update own supplies"
ON public.supplies
FOR UPDATE
USING (
  auth.uid() = supplier_id 
  AND public.has_role(auth.uid(), 'supplier')
);

-- Update the handle_new_user function to insert into user_roles and prevent admin signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _role user_role;
BEGIN
  -- Get role from metadata, default to supplier
  _role := COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'supplier'::user_role);
  
  -- Prevent admin role assignment via signup
  IF _role = 'admin' THEN
    RAISE EXCEPTION 'Admin role cannot be assigned during signup';
  END IF;

  -- Insert profile (keep role column for backward compatibility)
  INSERT INTO public.profiles (id, full_name, role, organization_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    _role,
    NEW.raw_user_meta_data->>'organization_name'
  );
  
  -- Insert into user_roles table (actual source of truth)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, _role);
  
  RETURN NEW;
END;
$$;