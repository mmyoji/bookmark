import { runReminder } from "@/lib/cron/reminder.ts";

Deno.cron("Remind older bookmarks", "0 23 * * *", runReminder);
