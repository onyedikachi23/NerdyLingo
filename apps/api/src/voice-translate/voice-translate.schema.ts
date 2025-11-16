/** @format */

import { users } from "@/users/users.schema";
import { sql } from "drizzle-orm";
import { integer } from "drizzle-orm/pg-core";
import { text } from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";
import { timestamp, varchar } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";

const conversations = pgTable("conversations", {
	id: uuid("id")
		.primaryKey()
		.default(sql`gen_random_uuid()`)
		.notNull(),
	userId: integer("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	createdAt: timestamp("created_at", { mode: "string" })
		.defaultNow()
		.notNull(),
});

type Conversation = typeof conversations.$inferSelect;

const utterances = pgTable("utterances", {
	id: uuid("id")
		.primaryKey()
		.default(sql`gen_random_uuid()`)
		.notNull(),
	conversationId: uuid("conversation_id")
		.notNull()
		.references(() => conversations.id, { onDelete: "cascade" }),
	speaker: varchar("speaker", { enum: ["user", "guest"] }).notNull(),
	sourceText: text("source_text").notNull(),
	translatedText: text("translated_text").notNull(),
	createdAt: timestamp("created_at", { mode: "string" })
		.defaultNow()
		.notNull(),
});

type Utterance = typeof utterances.$inferSelect;

export { conversations, utterances };
export type { Conversation, Utterance };
