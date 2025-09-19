import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase, getCurrentUser, signOut, User } from "../lib/supabase";
import { useToast } from "./use-toast";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, username: string, fullName?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  refreshUserData: () => Promise<void>;
  isLoading: boolean;
  isConnected: boolean;
}

const SupabaseAuthContext = createContext<AuthContextType | undefined>(undefined);

// Session persistence helper
const USER_KEY = 'promptops.user.profile';

export function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const [isFetchingProfile, setIsFetchingProfile] = useState(false);
  const { toast } = useToast();

  // Helper to save user to localStorage for persistence
  const saveUserToStorage = (userData: User | null) => {
    try {
      if (userData) {
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
      } else {
        localStorage.removeItem(USER_KEY);
      }
    } catch (e) {
      console.warn('Failed to save user to localStorage:', e);
    }
  };

  // Helper to load user from localStorage
  const loadUserFromStorage = (): User | null => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      console.warn('Failed to load user from localStorage:', e);
      return null;
    }
  };

  const fetchUserProfile = async (userId: string) => {
    // DISABLED - using simple user creation instead
    return;
    // Prevent multiple simultaneous calls
    if (isFetchingProfile) {
      console.log('⏳ Profile fetch already in progress, skipping...');
      return;
    }

    try {
      console.log('👤 Fetching profile for user:', userId);
      setIsFetchingProfile(true);
      setIsLoading(true);

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .limit(1);

      if (error || !data || data?.length === 0) {
        console.error('Profile fetch error:', error);

        // If user doesn't exist in database, create them from auth data
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
          console.log('Creating fallback user profile immediately...');
          const baseUsername = (authUser!.email?.split('@')[0] || 'user').replace(/[^a-zA-Z0-9_\-]/g, '').slice(0, 20) || 'user';

          // Create fallback user immediately to prevent auth loops
          const fallbackUser: User = {
            id: authUser!.id,
            email: authUser!.email || '',
            username: baseUsername,
            full_name: authUser!.user_metadata?.full_name || '',
            avatar_url: authUser!.user_metadata?.avatar_url || undefined,
            plan: 'free',
            prompts_used: 0,
            enhancements_used: 0,
            api_calls_used: 0,
            bio: undefined,
            website: undefined,
            location: undefined,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };

          setUser(fallbackUser);
          saveUserToStorage(fallbackUser);
          setIsLoading(false);
          console.log('✅ Using fallback user profile');
          return;
        } else {
          throw new Error('No auth user found');
        }
      } else {
        const userData = data![0];
        console.log('✅ Profile fetched successfully:', userData.username);
        setUser(userData);
        saveUserToStorage(userData);
        setIsLoading(false);
        return; // Important: return here to prevent further execution
      }
    } catch (error) {
      console.error('💥 Profile fetch error:', error);
      setIsLoading(false);
      setUser(null);
      saveUserToStorage(null);

      toast({
        title: "Profile Error",
        description: "Failed to load your profile. Please try logging in again.",
        variant: "destructive"
      });
    } finally {
      setIsFetchingProfile(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    let initTimeout: NodeJS.Timeout;

    const initializeAuth = async () => {
      try {
        setIsConnected(true);
        setIsLoading(true);

        // Load cached user first for immediate UI
        const cachedUser = loadUserFromStorage();
        if (cachedUser && mounted) {
          console.log('✅ Using cached user:', cachedUser.email);
          setUser(cachedUser);
          setIsLoading(false);
          setIsFetchingProfile(false);
          return; // Use cached user and don't fetch from server to avoid issues
        }

        // Set a shorter timeout to prevent infinite loading
        initTimeout = setTimeout(() => {
          if (mounted && isLoading) {
            console.warn('⚠️ Auth initialization timeout, falling back to logged out state');
            setUser(null);
            saveUserToStorage(null);
            setIsLoading(false);
          }
        }, 2000); // 2 second timeout

        const { data: { session }, error } = await supabase.auth.getSession();
        if (!mounted) return;

        // Clear timeout since we got a response
        if (initTimeout) clearTimeout(initTimeout);

        if (error) {
          console.error('❌ Session error:', error);
          setUser(null);
          saveUserToStorage(null);
          setIsLoading(false);
          return;
        }

        if (session?.user) {
          console.log('📱 Found session for:', session.user.email);

          // Fetch real user data from server instead of hardcoding plan
          try {
            const realUser = await getCurrentUser();
            if (realUser) {
              console.log('✅ Got real user data with plan:', realUser.plan);
              setUser(realUser);
              saveUserToStorage(realUser);
              setIsLoading(false);
            } else {
              // Fallback to simple user if server fetch fails
              const simpleUser: User = {
                id: session.user.id,
                email: session.user.email || '',
                username: session.user.email?.split('@')[0] || 'user',
                full_name: session.user.user_metadata?.full_name || '',
                avatar_url: session.user.user_metadata?.avatar_url || undefined,
                plan: 'free',
                prompts_used: 0,
                enhancements_used: 0,
                api_calls_used: 0,
                bio: undefined,
                website: undefined,
                location: undefined,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              };
              setUser(simpleUser);
              saveUserToStorage(simpleUser);
              setIsLoading(false);
            }
          } catch (error) {
            console.error('Failed to fetch real user data:', error);
            // Fallback to simple user
            const simpleUser: User = {
              id: session.user.id,
              email: session.user.email || '',
              username: session.user.email?.split('@')[0] || 'user',
              full_name: session.user.user_metadata?.full_name || '',
              avatar_url: session.user.user_metadata?.avatar_url || undefined,
              plan: 'free',
              prompts_used: 0,
              enhancements_used: 0,
              api_calls_used: 0,
              bio: undefined,
              website: undefined,
              location: undefined,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
            setUser(simpleUser);
            saveUserToStorage(simpleUser);
            setIsLoading(false);
          }
        } else {
          console.log('❌ No session found');
          setUser(null);
          saveUserToStorage(null);
          setIsLoading(false);
        }
      } catch (e) {
        console.error('💥 Auth init failed:', e);
        if (mounted) {
          setUser(null);
          saveUserToStorage(null);
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      console.log('🔄 Auth state changed:', event);

      if (event === 'SIGNED_IN' && session?.user) {
        // Fetch real user data from server
        try {
          const realUser = await getCurrentUser();
          if (realUser) {
            console.log('✅ Auth state change - got real user data with plan:', realUser.plan);
            setUser(realUser);
            saveUserToStorage(realUser);
            setIsLoading(false);
          } else {
            // Fallback to simple user
            const simpleUser: User = {
              id: session.user.id,
              email: session.user.email || '',
              username: session.user.email?.split('@')[0] || 'user',
              full_name: session.user.user_metadata?.full_name || '',
              avatar_url: session.user.user_metadata?.avatar_url || undefined,
              plan: 'free',
              prompts_used: 0,
              enhancements_used: 0,
              api_calls_used: 0,
              bio: undefined,
              website: undefined,
              location: undefined,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
            setUser(simpleUser);
            saveUserToStorage(simpleUser);
            setIsLoading(false);
          }
        } catch (error) {
          console.error('Failed to fetch real user data on auth change:', error);
          // Fallback to simple user
          const simpleUser: User = {
            id: session.user.id,
            email: session.user.email || '',
            username: session.user.email?.split('@')[0] || 'user',
            full_name: session.user.user_metadata?.full_name || '',
            avatar_url: session.user.user_metadata?.avatar_url || undefined,
            plan: 'free',
            prompts_used: 0,
            enhancements_used: 0,
            api_calls_used: 0,
            bio: undefined,
            website: undefined,
            location: undefined,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          setUser(simpleUser);
          saveUserToStorage(simpleUser);
          setIsLoading(false);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        saveUserToStorage(null);
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      if (initTimeout) clearTimeout(initTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      console.log('🔐 Attempting login for:', email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        toast({
          title: "Sign in failed",
          description: error.message || "Invalid email or password",
          variant: "destructive",
        });
        return { success: false, error: error.message };
      }

      if (data?.user) {
        console.log('✅ Supabase login successful for:', data.user.email);

        // Establish server-side session by calling a sync endpoint
        try {
          // Call server-side auth sync endpoint to establish session
          const syncResponse = await fetch('/api/auth/sync-supabase', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${data.session?.access_token}`
            },
            credentials: 'include',
            body: JSON.stringify({
              user_id: data.user.id,
              email: data.user.email
            })
          });

          if (!syncResponse.ok) {
            throw new Error('Auth sync failed');
          }

          const syncData = await syncResponse.json();
          console.log('✅ Server session established via sync');

          // Set the user data from sync response
          if (syncData.user) {
            console.log('✅ Login - got real user data with plan:', syncData.user.plan);
            setUser(syncData.user);
            saveUserToStorage(syncData.user);
          } else {
            throw new Error('No user data in sync response');
          }
        } catch (error) {
          console.error('Failed to establish server session or fetch user data:', error);
          // Fallback to simple user
          const simpleUser: User = {
            id: data.user.id,
            email: data.user.email || '',
            username: data.user.email?.split('@')[0] || 'user',
            full_name: data.user.user_metadata?.full_name || '',
            avatar_url: data.user.user_metadata?.avatar_url || undefined,
            plan: 'free',
            prompts_used: 0,
            enhancements_used: 0,
            api_calls_used: 0,
            bio: undefined,
            website: undefined,
            location: undefined,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          setUser(simpleUser);
          saveUserToStorage(simpleUser);
        }

        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });

        // Redirect to dashboard
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 500);

        return { success: true };
      } else {
        return { success: false, error: "Invalid credentials" };
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Sign in failed",
        description: error.message || "Login failed",
        variant: "destructive",
      });
      return { success: false, error: error.message || "Login failed" };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, username: string, fullName?: string) => {
    try {
      setIsLoading(true);
      console.log('📝 Attempting registration for:', email);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            username: username,
          }
        }
      });

      if (error) {
        console.error('Registration error:', error);
        toast({
          title: "Registration Failed",
          description: error.message || "Failed to create account. Please try again.",
          variant: "destructive",
        });
        return { success: false, error: error.message };
      }

      if (data?.user) {
        console.log('✅ Registration successful for:', data.user.email);
        toast({
          title: "Account Created!",
          description: data.user.email_confirmed_at
            ? "Welcome to PromptOps! You can now start creating prompts."
            : "Please check your email to confirm your account.",
        });

        // Redirect to login page
        setTimeout(() => {
          window.location.href = '/login';
        }, 1000);

        return { success: true };
      } else {
        return { success: false, error: "Registration failed" };
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to create account. Please try again.",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('🚪 Logout initiated');
      setIsLoading(true);

      // Call server-side logout first to clear session
      try {
        console.log('🚪 Calling server logout...');
        const response = await fetch('/api/logout', {
          method: 'POST',
          credentials: 'include'
        });
        console.log('🚪 Server logout response:', response.status);
      } catch (serverError) {
        console.warn('Server logout failed:', serverError);
      }

      // Then call Supabase logout
      console.log('🚪 Calling Supabase logout...');
      await signOut();
      console.log('🚪 Supabase logout complete');

      setUser(null);
      saveUserToStorage(null);

      // Clear any cached data
      localStorage.removeItem('promptop-user');
      localStorage.removeItem('promptops.user.profile');

      console.log('🚪 User state cleared, redirecting...');

      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });

      // Immediate redirect without delay
      window.location.href = '/login';
    } catch (error: any) {
      console.error('Logout error:', error);
      setUser(null);
      saveUserToStorage(null);
      localStorage.removeItem('promptop-user');
      localStorage.removeItem('promptops.user.profile');
      toast({
        title: "Signed Out",
        description: "You have been signed out.",
      });
      window.location.href = '/login';
    } finally {
      setIsLoading(false);
    }
  };

  // Function to refresh user data from server
  const refreshUserData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const syncResponse = await fetch('/api/auth/sync-supabase', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
          credentials: 'include',
          body: JSON.stringify({
            user_id: session.user.id,
            email: session.user.email
          })
        });

        if (syncResponse.ok) {
          const syncData = await syncResponse.json();
          console.log('✅ User data refreshed:', syncData.user.email, 'Plan:', syncData.user.plan);
          setUser(syncData.user);
          saveUserToStorage(syncData.user);
          return syncData.user;
        }
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
    return null;
  };

  const refreshUser = async () => {
    if (!user?.id) return;

    try {
      console.log('🔄 Refreshing user data...');
      console.log('🔄 Current user state:', { prompts_used: user.prompts_used, enhancements_used: user.enhancements_used });

      const updatedUser = await getCurrentUser();
      console.log('🔄 Fresh user from DB:', updatedUser);

      if (updatedUser) {
        console.log('✅ User refreshed - Old:', user.prompts_used, user.enhancements_used);
        console.log('✅ User refreshed - New:', updatedUser.prompts_used, updatedUser.enhancements_used);

        // Force a complete state update
        setUser(null);
        setTimeout(() => {
          setUser(updatedUser);
          saveUserToStorage(updatedUser);
          console.log('✅ User state forcefully updated');
        }, 100);
      }
    } catch (error) {
      console.error('❌ Failed to refresh user:', error);
    }
  };

  return (
    <SupabaseAuthContext.Provider value={{ user, login, register, logout, refreshUser, refreshUserData, isLoading, isConnected }}>
      {children}
    </SupabaseAuthContext.Provider>
  );
}

export function useSupabaseAuth() {
  const context = useContext(SupabaseAuthContext);
  if (context === undefined) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider');
  }
  return context;
}
