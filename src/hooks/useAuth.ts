import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/auth.service';

export function useAuthListener() {
  const { setSession, setProfile, setLoading, clear } = useAuthStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        authService.getProfile(session.user.id)
          .then(setProfile)
          .catch(() => {});
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        if (session?.user) {
          authService.getProfile(session.user.id)
            .then(setProfile)
            .catch(() => {});
        } else {
          clear();
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);
}
