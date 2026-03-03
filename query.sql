-- Create Profiles Table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users not null primary key,
  full_name text,
  country text,
  gender text,
  hobbies text,
  tags text[] default '{}', -- User's preferred tags for tailored feeds
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create Notes Table
create table public.notes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  title text not null,
  content text,
  is_favourite boolean default false,
  is_uncompleted boolean default true,
  is_public boolean default false, -- Public/Private toggle
  tags text[] not null check (array_length(tags, 1) >= 2), -- Enforces at least two tags
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
alter table public.notes enable row level security;

-- RLS Policies
-- Users can see their own notes, OR any note that is marked as public
create policy "Notes are viewable by owner or if public" on public.notes 
  for select using (auth.uid() = user_id or is_public = true);

-- Users can only insert/update/delete their own notes
create policy "Users can insert their own notes" on public.notes for insert with check (auth.uid() = user_id);
create policy "Users can update their own notes" on public.notes for update using (auth.uid() = user_id);
create policy "Users can delete their own notes" on public.notes for delete using (auth.uid() = user_id);