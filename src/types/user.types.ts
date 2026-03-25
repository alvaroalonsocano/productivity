export interface UserProfile {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  timezone: string;
  theme: 'light' | 'dark' | 'system';
  created_at: string;
  updated_at: string;
}
