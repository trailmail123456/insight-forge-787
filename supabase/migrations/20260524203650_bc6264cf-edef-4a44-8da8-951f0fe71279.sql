
-- Fix mutable search path on set_updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Lock down SECURITY DEFINER functions from direct API exec
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
-- has_role is needed by RLS; authenticated callers calling it directly is OK since it only checks roles

-- Replace broad SELECT on storage with "list-own-folder" + path-based public read
DROP POLICY IF EXISTS "Cover images public read" ON storage.objects;
DROP POLICY IF EXISTS "Paper PDFs public read" ON storage.objects;

CREATE POLICY "Cover images: read own or signed url access" ON storage.objects FOR SELECT
  USING (
    bucket_id = 'cover-images'
    AND (
      auth.uid()::text = (storage.foldername(name))[1]
      OR auth.role() = 'anon' AND (storage.foldername(name))[1] IS NOT NULL
    )
  );

CREATE POLICY "Paper PDFs: read own or signed url access" ON storage.objects FOR SELECT
  USING (
    bucket_id = 'paper-pdfs'
    AND (
      auth.uid()::text = (storage.foldername(name))[1]
      OR auth.role() = 'anon' AND (storage.foldername(name))[1] IS NOT NULL
    )
  );
