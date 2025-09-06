// Admin Setup Script
// Run this in your browser console to create an admin user
// Make sure you're logged in as the user you want to make admin

const createAdminUser = async () => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('No user logged in');
      return;
    }

    console.log('Creating admin profile for user:', user.email);

    // Create or update profile with admin role
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        user_id: user.id,
        full_name: user.user_metadata?.full_name || 'Admin User',
        role: 'admin',
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating admin profile:', error);
    } else {
      console.log('Admin profile created successfully:', data);
      console.log('You can now access the admin panel at /admin');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

// Uncomment the line below to run the script
// createAdminUser();
