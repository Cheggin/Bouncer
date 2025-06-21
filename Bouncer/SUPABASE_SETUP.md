# Supabase Setup Guide

This guide will help you set up Supabase to display authentication data in your Bouncer app.

## 1. Environment Variables

Create a `.env` file in the root of your Bouncer project with the following variables:

```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your Supabase project dashboard under Settings > API.

## 2. Database Setup

Since the `auth.users` table is not directly accessible via the client, you'll need to create a view or function to access the authentication data. Here are a few options:

### Option A: Create a View (Recommended)

Run this SQL in your Supabase SQL editor:

```sql
-- Create a view to expose auth users data
CREATE OR REPLACE VIEW auth_users_view AS
SELECT 
  id,
  email,
  created_at,
  updated_at,
  last_sign_in_at,
  raw_user_meta_data->>'role' as role
FROM auth.users;

-- Grant access to the view
GRANT SELECT ON auth_users_view TO authenticated;
GRANT SELECT ON auth_users_view TO anon;
```

### Option B: Create a Function

```sql
-- Create a function to get auth users
CREATE OR REPLACE FUNCTION get_auth_users()
RETURNS TABLE (
  id uuid,
  email text,
  created_at timestamptz,
  updated_at timestamptz,
  last_sign_in_at timestamptz,
  role text
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    au.id,
    au.email,
    au.created_at,
    au.updated_at,
    au.last_sign_in_at,
    au.raw_user_meta_data->>'role' as role
  FROM auth.users au;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_auth_users() TO authenticated;
GRANT EXECUTE ON FUNCTION get_auth_users() TO anon;
```

If you use Option B, update the `AuthDataTable.tsx` component to call the function instead:

```typescript
const { data, error } = await supabase
  .rpc('get_auth_users')
  .order('created_at', { ascending: false });
```

## 3. Row Level Security (RLS)

Make sure you have appropriate RLS policies in place. For development, you might want to temporarily disable RLS on the view:

```sql
ALTER VIEW auth_users_view DISABLE ROW LEVEL SECURITY;
```

For production, create proper RLS policies based on your security requirements.

## 4. Testing

1. Start your Expo development server: `npm start`
2. The app should now display authentication data in a table format
3. If you see an error, check the console for more details

## 5. Customization

You can modify the `AuthDataTable.tsx` component to:
- Add more columns
- Change the styling
- Add sorting functionality
- Implement pagination
- Add search/filter capabilities

## Troubleshooting

- **"Failed to fetch authentication data"**: Check your environment variables and Supabase connection
- **"No users found"**: Make sure you have users in your auth.users table
- **Permission errors**: Verify your RLS policies and view permissions 