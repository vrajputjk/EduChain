-- Fix RLS policies for security

-- 1. Drop existing overly permissive policies
DROP POLICY IF EXISTS "Anyone can view supplies" ON public.supplies;
DROP POLICY IF EXISTS "Anyone can view transactions" ON public.transactions;
DROP POLICY IF EXISTS "Anyone can view schools" ON public.schools;
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can view documents" ON public.documents;
DROP POLICY IF EXISTS "Users can view own documents" ON public.documents;
DROP POLICY IF EXISTS "Suppliers can update own supplies" ON public.supplies;

-- 2. Create proper restrictive policies for supplies
CREATE POLICY "Authenticated users can view supplies"
ON public.supplies FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Suppliers can update own supplies with role check"
ON public.supplies FOR UPDATE
TO authenticated
USING (auth.uid() = supplier_id AND public.has_role(auth.uid(), 'supplier'::user_role));

-- 3. Create proper restrictive policies for transactions
CREATE POLICY "Authenticated users can view transactions"
ON public.transactions FOR SELECT
TO authenticated
USING (true);

-- 4. Create proper restrictive policies for schools
CREATE POLICY "Authenticated users can view schools"
ON public.schools FOR SELECT
TO authenticated
USING (true);

-- 5. Create proper restrictive policies for profiles
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::user_role));

-- 6. Create proper restrictive policies for documents
CREATE POLICY "Users can view own documents"
ON public.documents FOR SELECT
TO authenticated
USING (auth.uid() = uploaded_by);

CREATE POLICY "Users can view documents for their supplies"
ON public.documents FOR SELECT
TO authenticated
USING (
  supply_id IN (
    SELECT id FROM public.supplies WHERE supplier_id = auth.uid()
  )
);