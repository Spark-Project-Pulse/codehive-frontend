// UserContext.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { type User } from '@/types/Users';
import { getUserById } from '@/api/users';
import { toast } from '@/components/ui/use-toast';

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  refetchUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  // Function to fetch and set the user from Supabase and backend
  const fetchUser = async () => {
    setLoading(true); // Set loading state before the request
    setError(null); // Clear any previous error

    try {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) {
        setUser(null);
        return;
      }

      const response = await getUserById(authUser.id);
      if (response.errorMessage) {
        // render error to the user
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'There was an error logging you in.',
        })
        throw new Error(response.errorMessage);
      }
      
      if (response.data) {
        setUser(response.data);
      } 

    } catch (error) {
      console.error('Error fetching user:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');

      // render error to the user
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'There was an error logging you in.',
      })
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchUser();
  }, []);

  // TODO: manually refresh user (optional)
  const refetchUser = async () => {
    await fetchUser();
  };

  return (
    <UserContext.Provider value={{ user, loading, error, refetchUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
