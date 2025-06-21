-- This script creates a trigger to invoke the 'risk-alert' Edge Function
-- when a profile's risk_level is updated or inserted to be over 50.

-- First, create the function that will be called by the trigger.
CREATE OR REPLACE FUNCTION public.notify_high_risk_user()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Check if the new risk_level is greater than 50
  IF NEW.risk_level > 50 THEN
    -- Asynchronously invoke the 'risk-alert' Edge Function
    PERFORM net.http_post(
        url:='https://pbvjexudrpretgejwhhs.supabase.co/functions/v1/risk-alert', -- Replace with your project's URL
        body:=jsonb_build_object('record', NEW)
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Finally, create the trigger on the 'profiles' table.
-- This trigger will fire after any INSERT or UPDATE operation.
CREATE TRIGGER on_profile_risk_change
  AFTER INSERT OR UPDATE OF risk_level ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_high_risk_user();

-- Add comments for documentation
COMMENT ON FUNCTION public.notify_high_risk_user() IS 'Invokes the risk-alert Edge Function if a user''s risk level exceeds 50.';
COMMENT ON TRIGGER on_profile_risk_change ON public.profiles IS 'Fires after a profile is inserted or its risk_level is updated.'; 