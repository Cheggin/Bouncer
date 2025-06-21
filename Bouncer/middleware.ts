import { ExpoRequest, ExpoResponse } from 'expo-router/server';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PASSWORD_STORAGE_KEY = 'site-password-authenticated';

export async function middleware(request: ExpoRequest): Promise<ExpoResponse | null> {
  const { pathname } = request.url;

  // Allow requests to the password page and API routes to pass through
  if (pathname.startsWith('/password') || pathname.startsWith('/api')) {
    return null; // Continue to the route
  }

  // Check if user is authenticated
  try {
    const isAuthenticated = await AsyncStorage.getItem(PASSWORD_STORAGE_KEY);
    
    if (isAuthenticated === 'true') {
      return null; // Continue to the route
    }
  } catch (error) {
    console.error('Error checking authentication:', error);
  }

  // If not authenticated, redirect to password page
  return ExpoResponse.redirect(new URL('/password', request.url));
}

// This config specifies which paths the middleware should run on.
// We want it to run on all paths except for static files.
export const config = {
  matcher: ['/((?!_next/static|favicon.ico|assets).*)'],
}; 