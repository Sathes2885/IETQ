import { supabase } from './supabase';
import { apiRequest } from './queryClient';
import { AuthResponse, LoginCredentials, RegisterData } from '@shared/types';

/**
 * Register a new user
 * @param userData User registration data
 */
export async function registerUser(userData: RegisterData): Promise<AuthResponse> {
  try {
    console.log("Registering user with data:", userData);

    // Build safe user metadata (all fields must be strings)
    const metadata: Record<string, string> = {
      role: userData.role,
      name: userData.name,
    };

    if (userData.grade) metadata.grade = String(userData.grade);
    if (userData.role === 'teacher') {
      if (userData.subject) metadata.subject = userData.subject;
      if (userData.qualification) metadata.qualification = userData.qualification;
      if (userData.experience) metadata.experience = String(userData.experience);
      if (userData.school) metadata.school = userData.school;
    }

    // Register with Supabase
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: metadata,
      },
    });

    if (error) {
      console.error("Supabase signup error:", error);
      throw new Error(error.message);
    }

    console.log("Supabase registration successful:", data);

    // Register user in your backend DB
    const response = await apiRequest('POST', '/api/auth/register', {
      ...userData,
      supabaseUserId: data.user?.id,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API register error:", errorData);
      throw new Error(errorData.message || 'Registration failed');
    }

    const userProfile = await response.json();
    console.log("User profile created successfully:", userProfile);

    return {
      user: userProfile,
      token: data.session?.access_token,
    };
  } catch (error) {
    console.error('Registration error:', error);
    return {
      user: null,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}

/**
 * Login a user
 */
export async function loginUser(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    console.log("Attempting login with:", credentials.email);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      console.error("Supabase login error:", error);
      throw new Error(error.message);
    }

    console.log("Login result:", {
      success: true,
      hasToken: !!data.session?.access_token,
    });

    const { data: userData } = await supabase.auth.getUser();
    console.log("Supabase user metadata:", userData?.user?.user_metadata);

    const response = await apiRequest('GET', '/api/auth/me');
    if (!response.ok) {
      const errorData = await response.json();
      console.error("API me error:", errorData);
      throw new Error(errorData.message || 'Login failed');
    }

    const userProfile = await response.json();
    console.log("User profile retrieved:", userProfile);

    return {
      user: userProfile,
      token: data.session?.access_token,
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      user: null,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}

/**
 * Logout the current user
 */
export async function logoutUser(): Promise<{ success: boolean, error?: string }> {
  try {
    console.log("Attempting to log out user");

    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Supabase logout error:", error);
      throw new Error(error.message);
    }

    console.log("Clearing cached user data");
    localStorage.removeItem('user');
    localStorage.removeItem('queryData');
    sessionStorage.clear();

    const response = await apiRequest('POST', '/api/auth/logout');
    if (!response.ok) {
      const errorData = await response.json();
      console.error("API logout error:", errorData);
      throw new Error(errorData.message || 'Logout failed');
    }

    console.log("Logout successful - refreshing application state");
    setTimeout(() => {
      window.location.href = '/';
    }, 100);

    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    console.log("Checking if user is authenticated");

    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      console.log("No Supabase session found");
      return false;
    }

    const response = await apiRequest('GET', '/api/auth/me');
    const isAuth = response.ok;
    console.log("Authentication check result:", isAuth);

    return isAuth;
  } catch (error) {
    console.error('Auth check error:', error);
    return false;
  }
}

/**
 * Get the current user profile
 */
export async function getCurrentUser(): Promise<AuthResponse> {
  try {
    console.log("Getting current user profile");

    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      console.log("No Supabase session found");
      return { user: null };
    }

    const existingUserCache = localStorage.getItem('user');
    if (existingUserCache) {
      const user = JSON.parse(existingUserCache);
      console.log("Using cached user data:", user);
      return { user, token: data.session.access_token };
    }

    const response = await apiRequest('GET', '/api/auth/me');
    if (!response.ok) {
      console.error("Error fetching user profile:", response.statusText);
      throw new Error('Failed to get user profile');
    }

    const userProfile = await response.json();
    console.log("User profile retrieved:", userProfile);

    const previousUserCache = localStorage.getItem('user');
    if (previousUserCache) {
      const parsedCache = JSON.parse(previousUserCache);
      if (parsedCache.role !== userProfile.role) {
        console.log(`User role changed from ${parsedCache.role} to ${userProfile.role}`);
      }
    }

    localStorage.setItem('user', JSON.stringify(userProfile));
    return {
      user: userProfile,
      token: data.session.access_token,
    };
  } catch (error) {
    console.error('Get current user error:', error);
    return {
      user: null,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}