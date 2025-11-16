-- This cleans up the conflicting foreign key data to allow the schema change in the next migration.
TRUNCATE TABLE "utterances" CASCADE;
--> statement-breakpoint
TRUNCATE TABLE "conversations" CASCADE;

-- 1. DROP all foreign key constraints first (using IF EXISTS for safety)

-- Drop the FK from 'utterances' referencing 'conversations.id'
ALTER TABLE "utterances" DROP CONSTRAINT IF EXISTS "utterances_conversation_id_conversations_id_fk";
--> statement-breakpoint

-- Drop the FK from 'conversations' referencing 'users.id'
ALTER TABLE "conversations" DROP CONSTRAINT IF EXISTS "conversations_user_id_users_id_fk";
--> statement-breakpoint

-- 2. Alter column types

-- Alter 'conversations.userId' from old type (likely varchar) to the correct INTEGER type
ALTER TABLE "conversations"
ALTER COLUMN "user_id" TYPE INTEGER USING "user_id"::integer; -- ADDED 'USING'
--> statement-breakpoint

-- Alter 'utterances.conversationId' from old type to the correct UUID type
ALTER TABLE "utterances"
ALTER COLUMN "conversation_id" TYPE UUID USING "conversation_id"::uuid; -- ADDED 'USING'
--> statement-breakpoint

-- 3. RE-ADD all foreign key constraints

-- Re-add FK from 'conversations' to 'users' (INTEGER to serial/INTEGER)
ALTER TABLE "conversations"
ADD CONSTRAINT "conversations_user_id_users_id_fk"
FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade;
--> statement-breakpoint

-- Re-add FK from 'utterances' to 'conversations' (UUID to UUID)
ALTER TABLE "utterances"
ADD CONSTRAINT "utterances_conversation_id_conversations_id_fk"
FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE cascade;