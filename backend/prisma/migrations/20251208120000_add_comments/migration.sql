-- Migration: add Comment model
-- Creates the Comment table with relations to User and News
CREATE TABLE IF NOT EXISTS "Comment" (
  "id" SERIAL PRIMARY KEY,
  "content" TEXT NOT NULL,
  "authorId" INTEGER NOT NULL,
  "newsId" INTEGER NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Foreign keys (use quoted names to match Prisma naming)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints tc
    WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name = 'Comment' AND tc.constraint_name = 'comment_author_fk'
  ) THEN
    ALTER TABLE "Comment"
      ADD CONSTRAINT comment_author_fk FOREIGN KEY ("authorId") REFERENCES "User" (id) ON DELETE CASCADE;
  END IF;
EXCEPTION WHEN duplicate_object THEN
  -- ignore
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints tc
    WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name = 'Comment' AND tc.constraint_name = 'comment_news_fk'
  ) THEN
    ALTER TABLE "Comment"
      ADD CONSTRAINT comment_news_fk FOREIGN KEY ("newsId") REFERENCES "News" (id) ON DELETE CASCADE;
  END IF;
EXCEPTION WHEN duplicate_object THEN
  -- ignore
END$$;

CREATE INDEX IF NOT EXISTS comment_news_idx ON "Comment" ("newsId");
