-- This script enables Row Level Security (RLS) and creates a policy
-- to allow public read access on your 'profiles' table.

-- Step 1: Ensure RLS is enabled on the profiles table.
-- If it's already enabled, this command will do nothing.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Step 2: Create a policy to allow read access (SELECT) for everyone.
-- This is a common setup for a public profiles table.
-- The policy will be named "Public profiles are viewable by everyone."
-- We use "CREATE POLICY ... IF NOT EXISTS" to avoid errors if you run it multiple times.

CREATE POLICY "Public profiles are viewable by everyone."
ON public.profiles
FOR SELECT
USING ( true );

-- After running this, your app should be able to fetch the profiles.

-- Add a comment for documentation purposes
COMMENT ON POLICY "Public profiles are viewable by everyone." ON public.profiles IS 'Allows all users and non-users to view profile information.'; 