
-- Posts: prevent authors from self-publishing
DROP POLICY IF EXISTS "Authors update own posts" ON public.posts;

CREATE POLICY "Authors update own posts"
ON public.posts
FOR UPDATE
TO authenticated
USING (auth.uid() = author_id)
WITH CHECK (
  auth.uid() = author_id
  AND (
    status = 'draft'::content_status
    OR public.has_role(auth.uid(), 'admin'::app_role)
  )
);

-- Papers: prevent uploaders from self-publishing
DROP POLICY IF EXISTS "Uploaders update own papers" ON public.papers;

CREATE POLICY "Uploaders update own papers"
ON public.papers
FOR UPDATE
TO authenticated
USING (auth.uid() = uploader_id)
WITH CHECK (
  auth.uid() = uploader_id
  AND (
    status = 'draft'::content_status
    OR public.has_role(auth.uid(), 'admin'::app_role)
  )
);
