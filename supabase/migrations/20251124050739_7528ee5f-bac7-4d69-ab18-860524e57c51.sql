-- Enable realtime for transactions table
ALTER TABLE public.transactions REPLICA IDENTITY FULL;

-- Add the table to the supabase_realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;

-- Create a function to update GPS coordinates for a supply
CREATE OR REPLACE FUNCTION public.update_supply_location(
  p_supply_id UUID,
  p_latitude NUMERIC,
  p_longitude NUMERIC,
  p_location_name TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_transaction_id UUID;
  v_current_status supply_status;
BEGIN
  -- Get current status
  SELECT current_status INTO v_current_status
  FROM supplies
  WHERE id = p_supply_id;

  -- Only update location if supply is in transit
  IF v_current_status = 'in_transit' THEN
    -- Insert new transaction with updated location
    INSERT INTO transactions (
      supply_id,
      transaction_type,
      from_location,
      to_location,
      status,
      latitude,
      longitude,
      block_hash
    )
    VALUES (
      p_supply_id,
      'GPS_UPDATE',
      p_location_name,
      p_location_name,
      v_current_status,
      p_latitude,
      p_longitude,
      encode(digest(p_supply_id::text || p_latitude::text || p_longitude::text || now()::text, 'sha256'), 'hex')
    )
    RETURNING id INTO v_transaction_id;

    RETURN v_transaction_id;
  ELSE
    RAISE EXCEPTION 'Supply is not in transit';
  END IF;
END;
$$;