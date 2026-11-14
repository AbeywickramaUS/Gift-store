-- ============================================================
-- Gift Store — Phase 2: Supabase Storage bucket for product media
--
-- Public bucket: anyone can VIEW files via their public URL
-- (getStorageUrl() in src/lib/supabase.ts). No upload/delete
-- policies are created, so only the service-role key (admin,
-- server-side) can add or remove files.
--
-- Size limit keeps uploads to images and SHORT clips — long
-- videos belong on YouTube/Cloudinary to protect the free-tier
-- egress allowance (see MediaItem.source).
-- ============================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-media',
  'product-media',
  true,
  20971520, -- 20 MB
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/avif',
    'video/mp4',
    'video/webm'
  ]
)
on conflict (id) do update set
  public             = excluded.public,
  file_size_limit    = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
