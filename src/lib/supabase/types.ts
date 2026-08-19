export type Profile = {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
};

export type Concert = {
  id: string;
  user_id: string;
  artist: string;
  venue: string;
  date: string;
  genre: string;
  score: number;
  notes: string;
  created_at: string;
};

export type ConcertInput = {
  artist: string;
  venue: string;
  date: string;
  genre: string;
  score: number;
  notes: string;
};
