import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "src/lib/db/schema.ts",
  out: "src/lib/db/out",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgres://postgres:@localhost:5432/gator?sslmode=disable", // TODO readConfig()
  },
});
