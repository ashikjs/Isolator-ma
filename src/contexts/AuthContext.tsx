import {createContext, useContext, useEffect, useState} from "react";
import {User} from "@supabase/supabase-js";
import {supabase} from "../lib/supabase";
import {checkSubscription} from "./../utils/subscription.ts";

interface AuthContextType {
  user: User | null;
  isSubscribed: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isSubscribed: false,
  loading: true,
});

export function AuthProvider({children}: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const {data: {session}} = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) {
        await checkSubscription(session.user.id);
      }
      setLoading(false);
    };

    checkUser();

    // Listen for auth state changes
    const {data: {subscription}} = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await checkSubscription(session.user.id);
        } else {
          setIsSubscribed(false);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{user, isSubscribed, loading}}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
