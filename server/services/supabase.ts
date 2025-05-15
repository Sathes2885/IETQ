import { createClient } from '@supabase/supabase-js';

// In a production app, you would use environment variables for these values
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('Missing Supabase configuration. Set VITE_SUPABASE_URL and SUPABASE_SERVICE_KEY or VITE_SUPABASE_ANON_KEY environment variables.');
}

// Create Supabase client with admin privileges
export const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Fetch all users from Supabase
 */
export async function fetchAllUsers() {
  try {
    const { data, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      console.error('Error fetching users from Supabase:', error);
      return [];
    }
    
    console.log(`Fetched ${data.users.length} users from Supabase`);
    return data.users;
  } catch (error) {
    console.error('Exception fetching users from Supabase:', error);
    return [];
  }
}

/**
 * Get user details from Supabase by ID
 */
export async function getUserById(userId: string) {
  try {
    const { data, error } = await supabase.auth.admin.getUserById(userId);
    
    if (error) {
      console.error('Error fetching user by ID from Supabase:', error);
      return null;
    }
    
    return data.user;
  } catch (error) {
    console.error('Exception fetching user by ID from Supabase:', error);
    return null;
  }
}

/**
 * Sync Supabase users with local storage
 */
export async function syncSupabaseUsers() {
  try {
    // This would be a real database operation in a production app
    if (!global.registeredUsers) {
      global.registeredUsers = [];
    }
    
    const supabaseUsers = await fetchAllUsers();
    
    if (!supabaseUsers || supabaseUsers.length === 0) {
      console.log('No users found in Supabase or unable to fetch');
      return;
    }
    
    // Map Supabase users to our format
    for (const supabaseUser of supabaseUsers) {
      // Check if user already exists in our storage
      const existingUser = global.registeredUsers.find(
        u => u.supabaseUserId === supabaseUser.id
      );
      
      if (!existingUser) {
        // Create new user in our storage
        const email = supabaseUser.email || '';
        let role = determineUserRole(supabaseUser, email);
        
        console.log(`Adding new user: ${email} with role ${role}`);
        
        global.registeredUsers.push({
          id: global.registeredUsers.length + 1,
          name: supabaseUser.user_metadata?.name || email.split('@')[0] || 'User',
          email: email,
          role: role,
          approvalStatus: role === 'teacher' ? 'pending' : 'approved',
          supabaseUserId: supabaseUser.id,
          createdAt: new Date(supabaseUser.created_at),
          updatedAt: new Date()
        });
      }
    }
    
    console.log(`Synced ${supabaseUsers.length} users from Supabase`);
    console.log(`Total users in local storage: ${global.registeredUsers.length}`);
    
  } catch (error) {
    console.error('Error syncing Supabase users:', error);
  }
}

/**
 * Determine user role based on Supabase user data
 */
function determineUserRole(supabaseUser: any, email: string): 'admin' | 'teacher' | 'student' {
  // Check user metadata first
  if (supabaseUser.user_metadata?.role) {
    const metadataRole = supabaseUser.user_metadata.role;
    if (metadataRole === 'admin' || metadataRole === 'teacher' || metadataRole === 'student') {
      return metadataRole;
    }
  }
  
  // Special admin emails
  if (email.includes('admin') || email.includes('sathesa')) {
    return 'admin';
  }
  
  // Teacher emails
  if (email.includes('teacher') || email.includes('faculty')) {
    return 'teacher';
  }
  
  // Default to student
  return 'student';
}