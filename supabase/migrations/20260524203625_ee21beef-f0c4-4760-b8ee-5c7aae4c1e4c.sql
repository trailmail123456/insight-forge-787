
-- Enums
CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'reader');
CREATE TYPE public.post_type AS ENUM ('essay', 'note', 'opinion', 'technical');
CREATE TYPE public.content_status AS ENUM ('draft', 'published');

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  website TEXT,
  twitter TEXT,
  github TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- User roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- Categories
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Tags
CREATE TABLE public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;

-- Posts
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL DEFAULT '',
  cover_image_url TEXT,
  post_type post_type NOT NULL DEFAULT 'essay',
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status content_status NOT NULL DEFAULT 'draft',
  featured BOOLEAN NOT NULL DEFAULT false,
  reading_minutes INTEGER,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
CREATE INDEX posts_status_published_idx ON public.posts(status, published_at DESC);
CREATE INDEX posts_author_idx ON public.posts(author_id);
CREATE TRIGGER posts_updated_at BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Papers
CREATE TABLE public.papers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  abstract TEXT,
  authors TEXT[] NOT NULL DEFAULT '{}',
  pdf_url TEXT,
  external_url TEXT,
  cover_image_url TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  uploader_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status content_status NOT NULL DEFAULT 'draft',
  featured BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.papers ENABLE ROW LEVEL SECURITY;
CREATE INDEX papers_status_published_idx ON public.papers(status, published_at DESC);
CREATE TRIGGER papers_updated_at BEFORE UPDATE ON public.papers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Junctions
CREATE TABLE public.post_tags (
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);
ALTER TABLE public.post_tags ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.paper_tags (
  paper_id UUID NOT NULL REFERENCES public.papers(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (paper_id, tag_id)
);
ALTER TABLE public.paper_tags ENABLE ROW LEVEL SECURITY;

-- ============ RLS POLICIES ============

-- Profiles: public read, self update, admin update
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Admins can update any profile" ON public.profiles FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- User roles: users see own; admins manage
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Categories: public read, admin write
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins manage categories" ON public.categories FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Tags: public read, admins + editors write
CREATE POLICY "Tags are viewable by everyone" ON public.tags FOR SELECT USING (true);
CREATE POLICY "Admins manage tags" ON public.tags FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Editors can insert tags" ON public.tags FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'editor'));

-- Posts: public reads published; authors manage own; admins manage all
CREATE POLICY "Published posts are public" ON public.posts FOR SELECT USING (status = 'published');
CREATE POLICY "Authors view own posts" ON public.posts FOR SELECT USING (auth.uid() = author_id);
CREATE POLICY "Admins view all posts" ON public.posts FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Authors insert own posts" ON public.posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors update own posts" ON public.posts FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Authors delete own posts" ON public.posts FOR DELETE USING (auth.uid() = author_id);
CREATE POLICY "Admins manage posts" ON public.posts FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Papers: same model
CREATE POLICY "Published papers are public" ON public.papers FOR SELECT USING (status = 'published');
CREATE POLICY "Uploaders view own papers" ON public.papers FOR SELECT USING (auth.uid() = uploader_id);
CREATE POLICY "Admins view all papers" ON public.papers FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Uploaders insert own papers" ON public.papers FOR INSERT WITH CHECK (auth.uid() = uploader_id);
CREATE POLICY "Uploaders update own papers" ON public.papers FOR UPDATE USING (auth.uid() = uploader_id);
CREATE POLICY "Uploaders delete own papers" ON public.papers FOR DELETE USING (auth.uid() = uploader_id);
CREATE POLICY "Admins manage papers" ON public.papers FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Post tags: public read; author/admin write
CREATE POLICY "Post tags viewable by everyone" ON public.post_tags FOR SELECT USING (true);
CREATE POLICY "Authors manage own post tags" ON public.post_tags FOR ALL
  USING (EXISTS (SELECT 1 FROM public.posts p WHERE p.id = post_id AND p.author_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.posts p WHERE p.id = post_id AND p.author_id = auth.uid()));
CREATE POLICY "Admins manage post tags" ON public.post_tags FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Paper tags
CREATE POLICY "Paper tags viewable by everyone" ON public.paper_tags FOR SELECT USING (true);
CREATE POLICY "Uploaders manage own paper tags" ON public.paper_tags FOR ALL
  USING (EXISTS (SELECT 1 FROM public.papers p WHERE p.id = paper_id AND p.uploader_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.papers p WHERE p.id = paper_id AND p.uploader_id = auth.uid()));
CREATE POLICY "Admins manage paper tags" ON public.paper_tags FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ STORAGE BUCKETS ============
INSERT INTO storage.buckets (id, name, public) VALUES ('cover-images', 'cover-images', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('paper-pdfs', 'paper-pdfs', true) ON CONFLICT DO NOTHING;

-- Storage policies: public read; authenticated upload to own folder
CREATE POLICY "Cover images public read" ON storage.objects FOR SELECT USING (bucket_id = 'cover-images');
CREATE POLICY "Authenticated upload cover images" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'cover-images' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Owners update cover images" ON storage.objects FOR UPDATE
  USING (bucket_id = 'cover-images' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Owners delete cover images" ON storage.objects FOR DELETE
  USING (bucket_id = 'cover-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Paper PDFs public read" ON storage.objects FOR SELECT USING (bucket_id = 'paper-pdfs');
CREATE POLICY "Authenticated upload paper pdfs" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'paper-pdfs' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Owners update paper pdfs" ON storage.objects FOR UPDATE
  USING (bucket_id = 'paper-pdfs' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Owners delete paper pdfs" ON storage.objects FOR DELETE
  USING (bucket_id = 'paper-pdfs' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Seed default categories
INSERT INTO public.categories (slug, name, description) VALUES
  ('ai', 'AI', 'Artificial intelligence research and writing'),
  ('llm', 'LLMs', 'Large language models'),
  ('computer-vision', 'Computer Vision', 'Vision systems and perception'),
  ('engineering', 'Engineering', 'Systems, infrastructure, tooling'),
  ('opinion', 'Opinion', 'Position pieces and commentary')
ON CONFLICT DO NOTHING;
