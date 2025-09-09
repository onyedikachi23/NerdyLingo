/** @format */

import { drizzle } from "drizzle-orm/node-postgres";
import schema from "./schema";

type DrizzleDB = ReturnType<typeof drizzle<typeof schema>>;
